// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Define levels data
const levels = {
    1: {
        title: "Complementary Angles",
        backgroundColor: '#ffffff',
        angles: [
            { value: 30, pair: 60 },
            { value: 45, pair: 45 },
            { value: 25, pair: 65 },
            { value: 40, pair: 50 }
        ],
        type: 'complementary'
    },
    2: {
        title: "Supplementary Angles",
        backgroundColor: '#f8f8f8',
        angles: [
            { value: 90, pair: 90 },
            { value: 120, pair: 60 },
            { value: 75, pair: 105 },
            { value: 150, pair: 30 }
        ],
        type: 'supplementary'
    },
    3: {
        title: "Mixed Angles",
        backgroundColor: '#f0f0f0',
        angles: [
            { value: 30, pair: 60, type: 'complementary' },
            { value: 120, pair: 60, type: 'supplementary' },
            { value: 45, pair: 45, type: 'complementary' },
            { value: 75, pair: 105, type: 'supplementary' }
        ],
        type: 'mixed'
    }
};

// Game state
const gameState = {
    score: 0,
    level: 1,
    draggableAngles: [],
    matchZones: [],
    isTransitioning: false,
    soundEnabled: true,
    ui: {
        scoreText: null,
        levelText: null,
        feedback: null
    }
};

// Initialize game
let game;
try {
    game = new Phaser.Game(config);
} catch (error) {
    console.error('Failed to initialize game:', error);
    document.getElementById('loading-screen').innerHTML = 'Failed to load game. Please refresh the page.';
}

function preload() {
    // Create particle texture
    const particles = this.add.graphics();
    particles.fillStyle(0xffffff, 1);
    particles.fillCircle(64, 64, 64);
    particles.generateTexture('particle', 128, 128);
    particles.destroy();
}

function create() {
    createBackground(this);
    createUI(this);
    initializeLevel(this, gameState.level);

    if (gameState.level === 1) {
        showTutorial(this);
    }

    this.input.on('gameobjectup', function (pointer, gameObject) {
        if (!gameState.isTransitioning && gameObject.parentContainer) {
            handleDragEnd(this.scene, gameObject.parentContainer);
        }
    });
}

function createBackground(scene) {
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 15; j++) {
            const x = i * 40 + 20;
            const y = j * 40 + 20;
            scene.add.circle(x, y, 3, 0x4a90e2, 0.1);
        }
    }
}

function createUI(scene) {
    gameState.ui.scoreText = scene.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000',
        fontFamily: 'Arial'
    });

    gameState.ui.levelText = scene.add.text(16, 56, `Level ${gameState.level}`, {
        fontSize: '32px',
        fill: '#000',
        fontFamily: 'Arial'
    });

    gameState.ui.feedback = scene.add.text(400, 550, '', {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
}

function drawAngle(graphics, x, y, angle, radius = 60, color = 0x4a90e2) {
    graphics.clear();
    graphics.lineStyle(3, color);
    
    // Draw base line
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + radius, y);
    graphics.strokePath();
    
    // Draw angle arc
    const angleRad = (angle * Math.PI) / 180;
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + radius * Math.cos(angleRad), y - radius * Math.sin(angleRad));
    graphics.strokePath();
    
    // Draw arc
    const arcRadius = radius / 3;
    graphics.beginPath();
    graphics.arc(x, y, arcRadius, 0, -angleRad, true);
    graphics.strokePath();
    
    // Add angle text
    return `${angle}°`;
}

function createDraggableAngle(scene, x, y, value, type) {
    const container = scene.add.container(x, y);
    const graphics = scene.add.graphics();
    container.add(graphics);
    
    // Draw the angle
    const text = drawAngle(graphics, 0, 0, value);
    
    // Add angle value text
    const angleText = scene.add.text(0, 30, text, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    container.add(angleText);
    
    // Make interactive area
    const hitArea = new Phaser.Geom.Circle(0, 0, 60);
    container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    scene.input.setDraggable(container);
    
    // Store data
    container.value = value;
    container.type = type;
    container.dragStartPos = { x, y };
    gameState.draggableAngles.push(container);
    
    // Add drag events
    scene.input.on('dragstart', (pointer, gameObject) => {
        if (gameObject === container) {
            gameObject.setScale(1.1);
        }
    });

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        if (gameObject === container) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        }
    });

    scene.input.on('dragend', (pointer, gameObject) => {
        if (gameObject === container) {
            gameObject.setScale(1);
            handleDragEnd(scene, container);
        }
    });
}

function createMatchZone(scene, x, y, value, type) {
    const graphics = scene.add.graphics();
    const zoneColor = 0xe8e8e8;
    
    // Draw the target angle
    drawAngle(graphics, x, y, value, 60, zoneColor);
    
    // Create hit zone
    const zone = scene.add.circle(x, y, 60);
    zone.setStrokeStyle(2, 0x000000);
    zone.setFillStyle(0xe8e8e8, 0.1);
    
    // Add text
    const text = scene.add.text(x, y + 30, `${value}°`, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Store data
    zone.value = value;
    zone.type = type;
    gameState.matchZones.push({ zone, text, graphics });
}

function handleDragEnd(scene, container) {
    if (gameState.isTransitioning) return;

    let matched = false;
    
    gameState.matchZones.forEach(({ zone }) => {
        if (Phaser.Geom.Intersects.CircleToCircle(
            new Phaser.Geom.Circle(container.x, container.y, 40),
            new Phaser.Geom.Circle(zone.x, zone.y, 40)
        )) {
            if (isCorrectMatch(container, zone)) {
                handleCorrectMatch(scene, container, zone);
                matched = true;
            } else {
                handleIncorrectMatch(scene, container);
                matched = true;
            }
        }
    });

    if (!matched) {
        returnToStart(scene, container);
    }
}

function returnToStart(scene, container) {
    scene.tweens.add({
        targets: container,
        x: container.dragStartPos.x,
        y: container.dragStartPos.y,
        duration: 300,
        ease: 'Back.easeOut'
    });
}

function isCorrectMatch(angle, zone) {
    if (angle.type === 'complementary') {
        return angle.value + zone.value === 90;
    } else if (angle.type === 'supplementary') {
        return angle.value + zone.value === 180;
    }
    return false;
}

function handleIncorrectMatch(scene, container) {
    scene.tweens.add({
        targets: container,
        x: container.dragStartPos.x,
        y: container.dragStartPos.y,
        duration: 300,
        ease: 'Back.easeOut'
    });

    if (container.type === 'complementary') {
        showFeedback(scene, 'Remember: Complementary angles sum to 90°', '#ff0000');
    } else {
        showFeedback(scene, 'Remember: Supplementary angles sum to 180°', '#ff0000');
    }

    gameState.score = Math.max(0, gameState.score - 20);
    gameState.ui.scoreText.setText(`Score: ${gameState.score}`);
}

function createParticleEffect(scene, x, y) {
    const particles = scene.add.particles('particle');
    
    const emitter = particles.createEmitter({
        x: x,
        y: y,
        speed: { min: -100, max: 100 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.1, end: 0 },
        blendMode: 'ADD',
        lifespan: 1000,
        tint: 0x4a90e2
    });

    scene.time.delayedCall(1000, () => {
        particles.destroy();
    });
}

function showFeedback(scene, message, color) {
    gameState.ui.feedback.setText(message);
    gameState.ui.feedback.setColor(color);
    gameState.ui.feedback.setAlpha(1);

    scene.tweens.add({
        targets: gameState.ui.feedback,
        alpha: 0,
        duration: 2000,
        ease: 'Power2'
    });
}



// Add these new functions for enhanced effects
function createSuccessRipple(scene, x, y) {
    const circle = scene.add.circle(x, y, 0, 0x4a90e2, 0.5);
    
    scene.tweens.add({
        targets: circle,
        radius: 100,
        alpha: 0,
        duration: 1000,
        ease: 'Quad.easeOut',
        onComplete: () => circle.destroy()
    });
}

function createFloatingText(scene, x, y, text, color = '#4a90e2') {
    const floatingText = scene.add.text(x, y, text, {
        fontSize: '28px',
        fill: color,
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: floatingText,
        y: y - 100,
        alpha: 0,
        duration: 1500,
        ease: 'Cubic.easeOut',
        onComplete: () => floatingText.destroy()
    });
}

function createStarBurst(scene, x, y) {
    const particles = scene.add.particles('particle');
    
    const emitter = particles.createEmitter({
        x: x,
        y: y,
        speed: { min: 200, max: 400 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.2, end: 0 },
        blendMode: 'ADD',
        lifespan: 1500,
        quantity: 20,
        tint: [0x4a90e2, 0xffd700, 0xff69b4]
    });

    scene.time.delayedCall(1500, () => {
        particles.destroy();
    });
}

// Add these new functions for angle visualization
/*function createAngleVisualization(scene, x, y, angle1, angle2, type) {
    const container = scene.add.container(x, y);
    const graphics = scene.add.graphics();
    container.add(graphics);
    
    // Set initial scale to 0
    container.setScale(0);
    
    // Draw the combined angles
    graphics.lineStyle(4, 0x4a90e2);
    
    // Base line
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(80, 0);
    graphics.strokePath();
    
    // First angle line
    const angle1Rad = (angle1 * Math.PI) / 180;
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(80 * Math.cos(angle1Rad), -80 * Math.sin(angle1Rad));
    graphics.strokePath();
    
    // Second angle line (animated)
    const angle2Rad = (angle2 * Math.PI) / 180;
    const finalX = 80 * Math.cos(angle1Rad + angle2Rad);
    const finalY = -80 * Math.sin(angle1Rad + angle2Rad);
    
    // Add labels
    const label1 = scene.add.text(-20, -40, `${angle1}°`, {
        fontSize: '20px',
        fill: '#4a90e2'
    }).setOrigin(0.5);
    container.add(label1);
    
    const label2 = scene.add.text(40, -60, `${angle2}°`, {
        fontSize: '20px',
        fill: '#4a90e2'
    }).setOrigin(0.5);
    container.add(label2);
    
    // Add total angle label
    const totalLabel = scene.add.text(0, -80, type === 'complementary' ? '90°' : '180°', {
        fontSize: '24px',
        fill: '#ff6b6b',
        fontWeight: 'bold'
    }).setOrigin(0.5);
    container.add(totalLabel);
    
    // Draw shape based on type
    if (type === 'complementary') {
        // Add small square to indicate right angle
        graphics.lineStyle(2, 0xff6b6b);
        graphics.beginPath();
        graphics.moveTo(15, 0);
        graphics.lineTo(15, -15);
        graphics.lineTo(0, -15);
        graphics.strokePath();
    } else {
        // Add arc for semicircle
        graphics.lineStyle(2, 0xff6b6b, 0.5);
        graphics.beginPath();
        graphics.arc(0, 0, 40, 0, Math.PI, true);
        graphics.strokePath();
    }
    
    // Animate container appearance
    scene.tweens.add({
        targets: container,
        scale: 1,
        duration: 500,
        ease: 'Back.easeOut'
    });
    
    // Animate second angle line drawing
    let progress = 0;
    const lineGraphics = scene.add.graphics();
    container.add(lineGraphics);
    
    scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 1000,
        ease: 'Cubic.easeOut',
        onUpdate: (tween) => {
            progress = tween.getValue();
            lineGraphics.clear();
            lineGraphics.lineStyle(4, 0x4a90e2);
            lineGraphics.beginPath();
            lineGraphics.moveTo(0, 0);
            lineGraphics.lineTo(
                finalX * progress,
                finalY * progress
            );
            lineGraphics.strokePath();
        }
    });
    
    // Remove visualization after delay
    scene.time.delayedCall(3000, () => {
        scene.tweens.add({
            targets: container,
            scale: 0,
            alpha: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => container.destroy()
        });
    });
}*/

function createAngleVisualization(scene, x, y, angle1, angle2, type) {
    const container = scene.add.container(x, y);
    const graphics = scene.add.graphics();
    container.add(graphics);
    
    // Set initial scale to 0
    container.setScale(0);
    
    // Draw the combined angles
    graphics.lineStyle(4, 0x4a90e2);
    
    // Base line
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(80, 0);
    graphics.strokePath();
    
    // First angle line
    const angle1Rad = (angle1 * Math.PI) / 180;
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(80 * Math.cos(angle1Rad), -80 * Math.sin(angle1Rad));
    graphics.strokePath();
    
    // Second angle line (animated)
    const angle2Rad = (angle2 * Math.PI) / 180;
    const finalX = 80 * Math.cos(angle1Rad + angle2Rad);
    const finalY = -80 * Math.sin(angle1Rad + angle2Rad);
    
    // Calculate label positions along slanting lines
    const label1X = 40 * Math.cos(angle1Rad) + 17; // Midpoint of first line
    const label1Y = -40 * Math.sin(angle1Rad) - 25;
    
    const label2X = 40 * Math.cos(angle1Rad + angle2Rad) - 18; // Midpoint of second line
    const label2Y = -40 * Math.sin(angle1Rad + angle2Rad) + 10;
    
    // Add labels along slanting lines
    const label1 = scene.add.text(label1X, label1Y, `${angle1}°`, {
        fontSize: '15px',
        fill: '#4a90e2'
    }).setOrigin(0.5);
    container.add(label1);
    
    const label2 = scene.add.text(label2X, label2Y, `${angle2}°`, {
        fontSize: '15px',
        fill: '#4a90e2'
    }).setOrigin(0.5);
    container.add(label2);
    
    // Add total angle label
    const totalLabelX = 40 * Math.cos((angle1 + angle2) * Math.PI / 360) + 10;
    const totalLabelY = -40 * Math.sin((angle1 + angle2) * Math.PI / 360) - 45; // Slight offset for visibility
    const totalLabel = scene.add.text(totalLabelX, totalLabelY, type === 'complementary' ? '90°' : '180°', {
        fontSize: '24px',
        fill: '#ff6b6b',
        fontWeight: 'bold'
    }).setOrigin(0.5);
    container.add(totalLabel);
    
    // Draw shape based on type
    if (type === 'complementary') {
        // Add small square to indicate right angle
        graphics.lineStyle(2, 0xff6b6b);
        graphics.beginPath();
        graphics.moveTo(15, 0);
        graphics.lineTo(15, -15);
        graphics.lineTo(0, -15);
        graphics.strokePath();
    } else {
        // Add arc for semicircle
        graphics.lineStyle(2, 0xff6b6b, 0.5);
        graphics.beginPath();
        graphics.arc(0, 0, 40, 0, Math.PI, true);
        graphics.strokePath();
    }
    
    // Animate container appearance
    scene.tweens.add({
        targets: container,
        scale: 1,
        duration: 500,
        ease: 'Back.easeOut'
    });
    
    // Animate second angle line drawing
    let progress = 0;
    const lineGraphics = scene.add.graphics();
    container.add(lineGraphics);
    
    scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 1000,
        ease: 'Cubic.easeOut',
        onUpdate: (tween) => {
            progress = tween.getValue();
            lineGraphics.clear();
            lineGraphics.lineStyle(4, 0x4a90e2);
            lineGraphics.beginPath();
            lineGraphics.moveTo(0, 0);
            lineGraphics.lineTo(
                finalX * progress,
                finalY * progress
            );
            lineGraphics.strokePath();
        }
    });
    
    // Remove visualization after delay
    scene.time.delayedCall(3000, () => {
        scene.tweens.add({
            targets: container,
            scale: 0,
            alpha: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => container.destroy()
        });
    });
}



// Update the handleCorrectMatch function to include the visualization
function handleCorrectMatch(scene, container, zone) {
    // Existing visual effects
    createSuccessRipple(scene, container.x, container.y);
    createStarBurst(scene, container.x, container.y);
    createFloatingText(scene, container.x, container.y - 30, '+100!');
    
    // Add angle visualization
    createAngleVisualization(
        scene,
        400, // Center of screen
        300, // Center of screen
        container.value,
        zone.value,
        container.type
    );
    
    // Update score with animation
    const currentScore = gameState.score;
    gameState.score += 100;
    
    scene.tweens.addCounter({
        from: currentScore,
        to: gameState.score,
        duration: 1000,
        ease: 'Cubic.easeOut',
        onUpdate: (tween) => {
            gameState.ui.scoreText.setText(`Score: ${Math.floor(tween.getValue())}`);
        }
    });
    
    showFeedback(scene, 'Perfect Match!', '#00ff00');
    
    // Fade out and remove the matched angle
    scene.tweens.add({
        targets: container,
        alpha: 0,
        scale: 1.5,
        duration: 500,
        ease: 'Back.easeIn',
        onComplete: () => {
            container.destroy();
            gameState.draggableAngles = gameState.draggableAngles.filter(a => a !== container);
            
            if (gameState.draggableAngles.length === 0) {
                scene.time.delayedCall(3500, () => {
                    handleLevelComplete(scene);
                });
            }
        }
    });
}

// Replace the existing handleLevelComplete function with this enhanced version
function handleLevelComplete(scene) {
    gameState.isTransitioning = true;

    // Create celebration container
    const celebrationContainer = scene.add.container(400, 300);
    
    // Add background overlay
    const overlay = scene.add.rectangle(0, 0, 800, 600, 0x000000, 0.7);
    celebrationContainer.add(overlay);
    
    // Create level complete text with glow effect
    const levelCompleteText = scene.add.text(0, -50, 'Level Complete!', {
        fontSize: '48px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#4a90e2',
        strokeThickness: 6
    }).setOrigin(0.5);
    celebrationContainer.add(levelCompleteText);

    // Add score bonus
    const bonusText = scene.add.text(0, 20, `Level Bonus: +500`, {
        fontSize: '32px',
        fill: '#ffd700',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    celebrationContainer.add(bonusText);

    // Create continue button
    const continueButton = scene.add.container(0, 100);
    const buttonBg = scene.add.rectangle(0, 0, 200, 50, 0x4a90e2, 1)
        .setInteractive()
        .on('pointerover', () => buttonBg.setFillStyle(0x64a5e8))
        .on('pointerout', () => buttonBg.setFillStyle(0x4a90e2))
        .on('pointerdown', () => buttonBg.setFillStyle(0x3780d1));
    
    const buttonText = scene.add.text(0, 0, 'Continue', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    continueButton.add([buttonBg, buttonText]);
    celebrationContainer.add(continueButton);

    // Add particle effects
    for (let i = 0; i < 3; i++) {
        scene.time.delayedCall(i * 500, () => {
            createStarBurst(scene, 
                400 + (Math.random() * 400 - 200),
                300 + (Math.random() * 200 - 100)
            );
        });
    }

    // Animate container entrance
    celebrationContainer.setScale(0);
    scene.tweens.add({
        targets: celebrationContainer,
        scale: 1,
        duration: 500,
        ease: 'Back.easeOut'
    });

    // Add button functionality
    buttonBg.on('pointerup', () => {
        // Add score bonus
        gameState.score += 500;
        gameState.ui.scoreText.setText(`Score: ${gameState.score}`);

        // Animate container exit
        scene.tweens.add({
            targets: celebrationContainer,
            scale: 0,
            duration: 400,
            ease: 'Back.easeIn',
            onComplete: () => {
                celebrationContainer.destroy();
                if (gameState.level < Object.keys(levels).length) {
                    gameState.level++;
                    initializeLevel(scene, gameState.level);
                } else {
                    showGameComplete(scene);
                }
                gameState.isTransitioning = false;
            }
        });
    });
}





function showGameComplete(scene) {
    clearLevel();

    const finalText = scene.add.text(400, 300,
        `Congratulations!\nYou've completed all levels!\nFinal Score: ${gameState.score}`,
        {
            fontSize: '40px',
            fill: '#000',
            fontFamily: 'Arial',
            align: 'center'
        }
    ).setOrigin(0.5);

    const replayButton = scene.add.text(400, 400, 'Play Again', {
        fontSize: '32px',
        fill: '#4a90e2',
        fontFamily: 'Arial'
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
        gameState.score = 0;
        gameState.level = 1;
        initializeLevel(scene, gameState.level);
        finalText.destroy();
        replayButton.destroy();
    });
}

function clearLevel() {
    gameState.draggableAngles.forEach(angle => angle.destroy());
    gameState.draggableAngles = [];
    
    gameState.matchZones.forEach(({ zone, text, graphics }) => {
        zone.destroy();
        text.destroy();
        graphics.destroy();
    });
    gameState.matchZones = [];
}

function initializeLevel(scene, currentLevel) {
    clearLevel();

    const levelData = levels[currentLevel];
    if (!levelData) {
        console.error('Invalid level:', currentLevel);
        return;
    }

    scene.cameras.main.setBackgroundColor(levelData.backgroundColor);
    
    levelData.angles.forEach((angle, index) => {
        const y = 150 + index * 120;
        createDraggableAngle(scene, 200, y, angle.value, angle.type || levelData.type);
        createMatchZone(scene, 600, y, angle.pair, angle.type || levelData.type);
    });

    gameState.ui.levelText.setText(`Level ${currentLevel} - ${levelData.title}`);
}

function showTutorial(scene) {
    const tutorial = scene.add.text(400, 300,
        'Welcome to Angle Pair Match-Up!\n\n' +
        'Drag angles from the left side\n' +
        'to match with their pairs on the right.\n\n' +
        'Click to start!',
        {
            fontSize: '24px',
            fill: '#000',
            fontFamily: 'Arial',
            align: 'center'
        }
    ).setOrigin(0.5);

    tutorial.setInteractive();
    tutorial.on('pointerdown', () => {
        tutorial.destroy();
    });
}

function update() {
    // Update loop can be used for continuous animations
}

window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Game Error:', error);
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.innerHTML = 'An error occurred. Please refresh the page.';
    }
    return false;
};