const config = {
    type: Phaser.AUTO,
    width: document.getElementById('game-container').offsetWidth,
    height: window.innerHeight - 50,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: createStartScreen,
        update: update
    }
};

const game = new Phaser.Game(config);

let questionText;
let answerButtons = [];
let draggableItems = [];
let dropZones = [];
let currentQuestion = 0;
let progressBar;
let progressText;

// Add new game state variables
let gameState = {
    score: 0,
    streak: 0,
    multiplier: 1,
    lives: 3,
    powerups: [],
    achievements: [],
    timeLeft: 60, // 1 minute in seconds
    isPaused: false,
    timer: null
};

// Add near the top with other global variables
let isMusicPlaying = true;
let musicButton;

// Add new global variable to store additional elements
let additionalElements = [];

// Add new global variable for selected difficulty
let selectedDifficulty = 'easy';

const questionBank = {
    easy: [
        { question: "What is the formula for the Pythagorean Theorem?", options: ["a² + b² = c²", "a² - b² = c²", "2a + b = c"], correct: 0, type: "multiple-choice" },
        { question: "Drag the correct formula to the box: a² + b² = ?", options: ["c²", "a²", "b²"], correct: 0, type: "drag-and-drop" },
        { question: "In this right triangle, a = 3, b = 4. Drag the correct value of c.", options: ["5", "7", "6"], correct: 0, type: "triangle-drag", triangleData: { a: 3, b: 4, c: 5 } },
        { question: "Drag the missing side length: If the hypotenuse is 13 and one side is 5", options: ["12", "8", "11"], correct: 0, type: "drag-and-drop" },
        { question: "Choose the correct set of numbers that satisfy the Pythagorean theorem.", options: ["(3, 4, 5)", "(5, 12, 14)", "(7, 24, 25)"], correct: 0, type: "multiple-choice" },
        { question: "In this triangle, a = 6, c = 10. Drag the correct value of b.", options: ["8", "9", "7"], correct: 0, type: "triangle-drag", triangleData: { a: 6, b: 8, c: 10 } },
        { question: "Drag the missing value: 5² + 12² = ?²", options: ["13", "14", "15"], correct: 0, type: "drag-and-drop" },
        { question: "Find the odd one out: Which set does not satisfy the theorem?", options: ["(6, 8, 10)", "(9, 12, 16)", "(5, 12, 13)"], correct: 1, type: "multiple-choice" },
        { question: "What is the value of c if a = 5 and b = 12?", options: ["13", "14", "15"], correct: 0, type: "multiple-choice" },
        { question: "Drag the correct value of c: a = 8, b = 15", options: ["17", "16", "18"], correct: 0, type: "drag-and-drop" }
    ],
    medium: [
        { question: "What is the value of b if a = 9 and c = 15?", options: ["12", "13", "14"], correct: 0, type: "multiple-choice" },
        { question: "Drag the correct value of a: b = 24, c = 25", options: ["7", "8", "9"], correct: 1, type: "drag-and-drop" },
        { question: "In this right triangle, a = 5, b = 12. Drag the correct value of c.", options: ["13", "14", "15"], correct: 0, type: "triangle-drag", triangleData: { a: 5, b: 12, c: 13 } },
        { question: "Drag the missing side length: If the hypotenuse is 17 and one side is 8", options: ["15", "12", "9"], correct: 2, type: "drag-and-drop" },
        { question: "Choose the correct set of numbers that satisfy the Pythagorean theorem.", options: ["(8, 15, 17)", "(9, 12, 16)", "(7, 24, 25)"], correct: 0, type: "multiple-choice" },
        { question: "In this triangle, a = 7, c = 25. Drag the correct value of b.", options: ["24", "23", "22"], correct: 0, type: "triangle-drag", triangleData: { a: 7, b: 24, c: 25 } },
        { question: "Drag the missing value: 9² + 12² = ?²", options: ["15", "16", "17"], correct: 2, type: "drag-and-drop" },
        { question: "Find the odd one out: Which set does not satisfy the theorem?", options: ["(10, 24, 26)", "(12, 16, 20)", "(15, 20, 25)"], correct: 0, type: "multiple-choice" },
        { question: "What is the value of c if a = 7 and b = 24?", options: ["25", "26", "27"], correct: 0, type: "multiple-choice" },
        { question: "Drag the correct value of c: a = 9, b = 40", options: ["41", "42", "43"], correct: 0, type: "drag-and-drop" }
    ],
    hard: [
        { question: "What is the value of b if a = 11 and c = 61?", options: ["60", "59", "58"], correct: 0, type: "multiple-choice" },
        { question: "Drag the correct value of a: b = 60, c = 61", options: ["11", "12", "13"], correct: 0, type: "drag-and-drop" },
        { question: "In this right triangle, a = 20, b = 21. Drag the correct value of c.", options: ["29", "30", "31"], correct: 0, type: "triangle-drag", triangleData: { a: 20, b: 21, c: 29 } },
        { question: "Drag the missing side length: If the hypotenuse is 65 and one side is 33", options: ["56", "57", "58"], correct: 0, type: "drag-and-drop" },
        { question: "Choose the correct set of numbers that satisfy the Pythagorean theorem.", options: ["(33, 56, 65)", "(36, 48, 60)", "(39, 52, 65)"], correct: 0, type: "multiple-choice" },
        { question: "In this triangle, a = 16, c = 34. Drag the correct value of b.", options: ["30", "31", "32"], correct: 2, type: "triangle-drag", triangleData: { a: 16, b: 32, c: 34 } },
        { question: "Drag the missing value: 12² + 35² = ?²", options: ["37", "38", "39"], correct: 2, type: "drag-and-drop" },
        { question: "Find the odd one out: Which set does not satisfy the theorem?", options: ["(15, 36, 39)", "(20, 21, 29)", "(28, 45, 53)"], correct: 2, type: "multiple-choice" },
        { question: "What is the value of c if a = 9 and b = 40?", options: ["41", "42", "43"], correct: 0, type: "multiple-choice" },
        { question: "Drag the correct value of c: a = 12, b = 35", options: ["37", "38", "39"], correct: 0, type: "drag-and-drop" }
    ]
};

let questions = [];

let score = 0;
let bgMusic; // Add this at the top with other global variables

function preload() {
    // Load SVG files
    this.load.svg('star', 'assets/star.svg');
    this.load.svg('heart', 'assets/heart.svg');
    // Load background image
    this.load.image('background', 'assets/background.jpg');

    // Add audio loading
    this.load.audio('bgMusic', 'assets/music.mp3');
    this.load.audio('correctSound', 'assets/correct.wav');
    this.load.audio('wrongSound', 'assets/wrong.wav');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle questions at start
shuffleArray(questions);

function createStartScreen() {
    const self = this;

    // Add background
    this.add.image(config.width / 2, config.height / 2, 'background')
        .setDisplaySize(config.width, config.height)
        .setDepth(-1);

    // Start background music here
    if (!bgMusic) {
        bgMusic = this.sound.add('bgMusic', {
            loop: true,
            volume: 0.3
        });
        bgMusic.play();
    }

    // Title
    this.add.text(config.width / 2, config.height / 3, 'Pythagoras Quest', {
        fontSize: '64px',
        fontWeight: 'bold',
        color: '#000000',
        align: 'center'
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.rectangle(config.width / 2, config.height / 2, 300, 80, 0x4CAF50)
        .setInteractive()
        .on('pointerdown', () => showDifficultySelection(self));

    this.add.text(config.width / 2, config.height / 2, 'Start Game', {
        fontSize: '32px',
        color: '#ffffff',
        align: 'center'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(config.width / 2, config.height * 0.7, 'Test your knowledge of the Pythagorean Theorem!\nAnswer questions and complete challenges.', {
        fontSize: '24px',
        color: '#000000',
        align: 'center'
    }).setOrigin(0.5);
}

function showDifficultySelection(scene) {
    // Clear start screen
    scene.children.removeAll();

    // Add background
    scene.add.image(config.width / 2, config.height / 2, 'background')
        .setDisplaySize(config.width, config.height)
        .setDepth(-1);

    // Title
    scene.add.text(config.width / 2, config.height / 3, 'Select Module', {
        fontSize: '64px',
        fontWeight: 'bold',
        color: '#000000',
        align: 'center'
    }).setOrigin(0.5);

    // Module buttons (maps to difficulties internally)
    const modules = ['Module 1', 'Module 2', 'Module 3'];
    const difficulties = ['easy', 'medium', 'hard']; // Internal mapping

    modules.forEach((module, index) => {
        const buttonBg = scene.add.rectangle(config.width / 2, config.height / 2 + index * 100, 300, 80, 0x4CAF50)
            .setInteractive()
            .on('pointerdown', () => {
                selectedDifficulty = difficulties[index];
                startGame(scene);
            });

        scene.add.text(config.width / 2, config.height / 2 + index * 100, module, {
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
    });
}

function startGame(scene) {
    // Clear difficulty selection screen
    scene.children.removeAll();

    // Select 5 random questions from the chosen difficulty level
    questions = [...questionBank[selectedDifficulty]];
    shuffleArray(questions);
    questions = questions.slice(0, 5);

    // Initialize game
    create.call(scene);
}

let ui; // Add global UI variable
let pauseButton;
let timerText;

function create() {
    const self = this;

    // Add background
    this.add.image(config.width / 2, config.height / 2, 'background')
        .setDisplaySize(config.width, config.height)
        .setDepth(-1);

    // Initialize UI first
    ui = createGameUI(this);

    questionText = this.add.text(config.width / 2, 100, '', {
        fontSize: '24px',
        color: '#000',
        align: 'center',
        wordWrap: { width: config.width * 0.8 },
        fontFamily: 'Arial',
        selectable: true
    }).setOrigin(0.5);

    // Progress bar
    const progressBarContainer = this.add.rectangle(50, config.height / 2, 30, config.height * 0.8, 0xcccccc);
    progressBar = this.add.rectangle(50, config.height * 0.1, 30, 0, 0x00cc00).setOrigin(0.5, 0);

    progressText = this.add.text(50, config.height * 0.9, '0%', {
        fontSize: '16px',
        color: '#000',
        align: 'center'
    }).setOrigin(0.5);

    // Answer buttons with updated visibility
    for (let i = 0; i < 3; i++) {
        const buttonBg = this.add.rectangle(
            config.width / 2,
            250 + i * 80,
            400,
            60,
            0x4CAF50
        ).setInteractive()
            .on('pointerdown', () => checkAnswer.call(self, i))  // Fix context
            .on('pointerover', () => buttonBg.setFillStyle(0x45a049))
            .on('pointerout', () => buttonBg.setFillStyle(0x4CAF50));

        const buttonText = this.add.text(buttonBg.x, buttonBg.y, '', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial',
            selectable: true
        }).setOrigin(0.5);

        buttonBg.setVisible(false);
        buttonText.setVisible(false);
        answerButtons.push({ button: buttonBg, buttonText });
    }

    // Drop zones for drag-and-drop questions
    for (let i = 0; i < 3; i++) {
        const dropZone = this.add.rectangle(config.width / 2, 250 + i * 80, 300, 60, 0x666666, 0.5)
            .setVisible(false)
            .setStrokeStyle(2, 0x000000);  // Add border to make drop zone more visible
        dropZones.push(dropZone);
    }

    // Add drag-and-drop event handlers
    this.input.on('dragstart', (pointer, gameObject) => {
        if (gameObject.list) { // If it's a container
            gameObject.list[0].setFillStyle(0xff0000);
        } else {
            gameObject.setTint(0xff0000);
        }
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        if (gameObject.list) { // If it's a container
            gameObject.x = dragX;
            gameObject.y = dragY;
        } else {
            gameObject.x = dragX;
            gameObject.y = dragY;
        }
    });

    this.input.on('dragend', (pointer, gameObject) => {
        if (gameObject.list) { // If it's a container
            gameObject.list[0].setFillStyle(0x4CAF50);
        } else {
            gameObject.clearTint();
        }

        const question = questions[currentQuestion];
        const dropZone = dropZones[0];

        if (question.type === "triangle-drag" && dropZone) {
            const distance = Phaser.Math.Distance.Between(
                gameObject.x,
                gameObject.y,
                dropZone.x,
                dropZone.y
            );

            if (distance < dropZone.radius) {
                const answer = gameObject.list ? gameObject.list[1].text : gameObject.text;
                if (answer === question.options[question.correct]) {
                    showFeedback(self, true);
                } else {
                    showFeedback(self, false);
                }
                cleanupCurrentQuestion();
                moveToNextQuestion();
            }
        } else if (question.type === "drag-and-drop" && dropZone) {
            if (Phaser.Geom.Rectangle.Contains(
                dropZone.getBounds(),
                gameObject.x,
                gameObject.y
            )) {
                if (gameObject.text === question.options[question.correct]) {
                    showFeedback(self, true);
                } else {
                    showFeedback(self, false);
                }
                cleanupCurrentQuestion();
                moveToNextQuestion();
            }
        }
    });

    displayQuestion = () => {
        const question = questions[currentQuestion];
        cleanupCurrentQuestion();
        questionText.setText(question.question);

        if (question.type === "multiple-choice") {
            // Show MCQ buttons and set their text
            answerButtons.forEach((btn, index) => {
                if (index < question.options.length) {
                    btn.button.setVisible(true);
                    btn.buttonText.setVisible(true);
                    btn.buttonText.setText(question.options[index]);
                }
            });

            // Hide any existing drop zones
            dropZones.forEach(zone => zone?.setVisible(false));
        } else if (question.type === "drag-and-drop") {
            // Hide MCQ buttons
            answerButtons.forEach(btn => {
                btn.button.setVisible(false);
                btn.buttonText.setVisible(false);
            });

            // Create drop zone
            const dropZone = this.add.rectangle(
                config.width / 2,
                config.height / 2,
                300,
                60,
                0x666666,
                0.5
            ).setStrokeStyle(2, 0x000000);
            dropZones.push(dropZone);

            // Create draggable items
            question.options.forEach((option, index) => {
                const item = self.add.text(100 + (index * 200), config.height - 100, option, {
                    fontSize: '28px',
                    fontWeight: 'bold',
                    backgroundColor: '#4CAF50',
                    color: '#ffffff',
                    padding: { x: 20, y: 15 },
                    fixedWidth: 150,
                    align: 'center',
                    borderRadius: '10px'
                })
                    .setInteractive({ useHandCursor: true, draggable: true })
                    .setOrigin(0.5);

                item.on('pointerover', () => item.setStyle({ backgroundColor: '#45a049' }));
                item.on('pointerout', () => item.setStyle({ backgroundColor: '#4CAF50' }));

                draggableItems.push(item);
            });

            dropZones[0].setVisible(true)
                .setPosition(config.width / 2, config.height / 2)
                .setOrigin(0.5);
        } else if (question.type === "triangle-drag") {
            answerButtons.forEach(btn => {
                btn.button.setVisible(false);
                btn.buttonText.setVisible(false);
            });

            draggableItems.forEach(item => item.destroy());
            draggableItems = [];

            // Draw triangle with larger scale
            const triangle = drawTriangle(self, config.width / 2 - 150, config.height / 2 + 150,
                question.triangleData.a, question.triangleData.b, 40); // increased scale to 40
            draggableItems.push(triangle);

            // Create draggable options with circular background
            question.options.forEach((option, index) => {
                const circleRadius = 30; // Same as triangle drop zone radius

                // Create circle and text first
                const circle = self.add.circle(0, 0, circleRadius, 0x4CAF50);
                const text = self.add.text(0, 0, option, {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);

                // Create container with position
                const container = self.add.container(100 + (index * 200), config.height - 100, [circle, text]);
                container.setSize(circleRadius * 2, circleRadius * 2);
                container.setInteractive({ useHandCursor: true, draggable: true });

                // Add hover effects directly to container
                container.on('pointerover', () => {
                    circle.setFillStyle(0x45a049);
                });
                container.on('pointerout', () => {
                    circle.setFillStyle(0x4CAF50);
                });

                draggableItems.push(container);
            });

            // Calculate triangle points with the new scale
            const baseX = config.width / 2 - 150;
            const baseY = config.height / 2 + 150;
            const height = question.triangleData.b * 40;
            const base = question.triangleData.a * 40;

            // Create larger circular drop zone outside the hypotenuse
            const hypotenuseAngle = Math.atan2(-height, base);
            const dropCircle = self.add.circle(
                baseX + (base / 2) + Math.cos(hypotenuseAngle) * 50,  // 50 pixels away from hypotenuse
                baseY - (height / 2) + Math.sin(hypotenuseAngle) * 50,
                30,                 // increased radius
                0x666666,
                0.3
            );
            dropCircle.radius = 30; // Store radius for collision detection
            dropCircle.setStrokeStyle(2, 0x000000);
            dropZones[0] = dropCircle;
        }

        updateProgress();
    };

    displayQuestion();

    // Add pause button with new styling
    pauseButton = this.add.container(config.width - 150, 20);

    const pauseBg = this.add.rectangle(0, 0, 120, 40, 0x4CAF50)
        .setStrokeStyle(2, 0x45a049);

    const pauseText = this.add.text(0, 0, 'PAUSE', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontWeight: 'bold'
    }).setOrigin(0.5);

    pauseButton.add([pauseBg, pauseText])
        .setSize(120, 40)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => togglePause(self))
        .on('pointerover', () => {
            pauseBg.setFillStyle(0x45a049);
            this.tweens.add({
                targets: pauseButton,
                scale: 1.1,
                duration: 100
            });
        })
        .on('pointerout', () => {
            pauseBg.setFillStyle(0x4CAF50);
            this.tweens.add({
                targets: pauseButton,
                scale: 1,
                duration: 100
            });
        });

    // Start timer
    startTimer(self);

    // Add warning animation when timer is low
    this.time.addEvent({
        delay: 100,
        callback: () => {
            if (gameState.timeLeft <= 10) {
                ui.timerText.setTint(0xff0000);
                this.tweens.add({
                    targets: ui.timerText,
                    scale: { from: 1, to: 1.2 },
                    duration: 200,
                    yoyo: true,
                    repeat: 0
                });
            }
        },
        loop: true
    });

    // Keep this timer text
    timerText = this.add.text(config.width - 100, 60, '60s', {
        fontSize: '24px',
        color: '#000000',
        fontFamily: 'Arial',
        selectable: true
    });

    // Create music control button
    const musicBtnBg = this.add.rectangle(0, 0, 120, 40, 0x4CAF50)
        .setStrokeStyle(2, 0x45a049);

    const musicBtnText = this.add.text(0, 0, 'MUSIC ON', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontWeight: 'bold'
    }).setOrigin(0.5);

    musicButton = this.add.container(config.width / 2, config.height - 30, [musicBtnBg, musicBtnText])
        .setSize(120, 40)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => toggleMusic())
        .on('pointerover', () => {
            musicBtnBg.setFillStyle(0x45a049);
        })
        .on('pointerout', () => {
            musicBtnBg.setFillStyle(isMusicPlaying ? 0x4CAF50 : 0x666666);
        });
}

function update() { }

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestion];
    if (question.type === "multiple-choice") {
        if (selectedIndex === question.correct) {
            gameState.score += 100 * gameState.multiplier;
            showFeedback(this, true);
        } else {
            showFeedback(this, false);
        }
        moveToNextQuestion();
    }
}

// Add new cleanup function
function cleanupCurrentQuestion() {
    draggableItems.forEach(item => item.destroy());
    draggableItems = [];

    dropZones.forEach(zone => {
        if (zone) {
            zone.destroy();
        }
    });
    dropZones = [];

    // Remove additional elements
    additionalElements.forEach(element => element.destroy());
    additionalElements = [];
}

function moveToNextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endGame();
    }
}

function updateProgress() {
    const progress = (currentQuestion / questions.length) * 100;
    progressBar.height = (config.height * 0.8 * currentQuestion) / questions.length;
    progressText.setText(`${Math.floor(progress)}%`);
}

function endGame() {
    // Stop timer
    if (gameState.timer) {
        this.time.removeEvent(gameState.timer);
    }

    if (gameState.lives <= 0) {
        questionText.setText('Game Over! You lost all lives!');
    } else {
        questionText.setText(
            gameState.timeLeft <= 0
                ? 'Time\'s up! Game Over!'
                : `Game Over! Your score: ${gameState.score}`
        );
    }

    // Clean up all game elements
    answerButtons.forEach(btn => {
        btn.button.destroy();
        btn.buttonText.destroy();
    });
    draggableItems.forEach(item => item.destroy());
    dropZones.forEach(zone => zone.destroy());
    progressBar.destroy();
    progressText.destroy();

    // Display retry button
    const retryButton = this.add.rectangle(
        config.width / 2,
        config.height / 2 + 100,
        200,
        50,
        0x4CAF50
    ).setInteractive()
        .on('pointerdown', () => window.location.reload());

    this.add.text(
        config.width / 2,
        config.height / 2 + 100,
        'Play Again',
        { fontSize: '20px', color: '#ffffff' }
    ).setOrigin(0.5);
}

function drawTriangle(scene, x, y, sideA, sideB, scale = 40) { // increased default scale
    const graphics = scene.add.graphics();
    graphics.lineStyle(3, 0x000000);

    // Calculate height using Pythagoras
    const height = sideB * scale;
    const base = sideA * scale;

    // Draw triangle
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + base, y);
    graphics.lineTo(x, y - height);
    graphics.lineTo(x, y);
    graphics.closePath();
    graphics.strokePath();

    // Add side labels
    const labelA = scene.add.text(x + base / 2, y + 10, `a = ${sideA}`, { fontSize: '16px', color: '#000' }).setOrigin(0.5);
    const labelB = scene.add.text(x - 20, y - height / 2, `b = ${sideB}`, { fontSize: '16px', color: '#000' }).setOrigin(1, 0.5);

    // Store additional elements for cleanup
    additionalElements.push(labelA, labelB);

    return graphics;
}

function createGameUI(scene) {
    if (!scene) return null;

    const ui = {
        scoreText: scene.add.text(10, 10, 'Score: 0', {
            fontSize: '24px',
            color: '#000',
            fontStyle: 'bold'
        }),
        streakText: scene.add.text(10, 40, 'Streak: 0', {
            fontSize: '20px',
            color: '#000'
        }),
        livesGroup: scene.add.group()
        // Remove the timerText from ui object
    };

    // Adjust hearts position - moved from y:120 to y:150
    for (let i = 0; i < gameState.lives; i++) {
        const heart = scene.add.image(config.width - 50 - (i * 50), 150, 'heart')
            .setScale(0.4);

        // Add hover animation
        scene.tweens.add({
            targets: heart,
            y: '+=5',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: i * 200 // Stagger the animations
        });

        ui.livesGroup.add(heart);
    }

    return ui;
}

function showFeedback(scene, correct) {
    if (!scene) return;

    // Play appropriate sound
    scene.sound.play(correct ? 'correctSound' : 'wrongSound', { volume: 0.5 });

    const feedbackConfig = {
        fontSize: '48px',
        color: correct ? '#00ff00' : '#ff0000',
        fontStyle: 'bold',
        fontFamily: 'Arial',
        selectable: true
    };

    const feedbackText = scene.add.text(
        config.width / 2,
        config.height / 2,
        correct ? 'CORRECT!' : 'WRONG!',
        feedbackConfig
    ).setOrigin(0.5);

    // Animate feedback
    scene.tweens.add({
        targets: feedbackText,
        scale: { from: 0, to: 1 },
        alpha: { from: 1, to: 0 },
        duration: 1000,
        ease: 'Back.easeOut',
        onComplete: () => feedbackText.destroy()
    });

    // Update game state
    if (correct) {
        gameState.streak++;
        gameState.multiplier = Math.min(3, 1 + Math.floor(gameState.streak / 3));
        gameState.score += 100 * gameState.multiplier;

        // Spawn stars effect
        for (let i = 0; i < 5; i++) {
            const star = scene.add.image(
                config.width / 2 + (Math.random() * 200 - 100),
                config.height / 2 + (Math.random() * 200 - 100),
                'star'
            ).setScale(0);

            scene.tweens.add({
                targets: star,
                scale: { from: 0, to: 0.5 },
                alpha: { from: 1, to: 0 },
                duration: 1000,
                ease: 'Back.easeOut',
                onComplete: () => star.destroy()
            });
        }
        moveToNextQuestion();  // Only move to next question if answer was correct
    } else {
        gameState.streak = 0;
        gameState.multiplier = 1;
        gameState.lives--;
        if (ui && ui.livesGroup) {
            const hearts = ui.livesGroup.getChildren();
            if (hearts[gameState.lives]) {
                hearts[gameState.lives].destroy();
            }
        }

        if (gameState.lives <= 0) {
            endGame.call(scene);
            return;
        } else {
            moveToNextQuestion();  // Only move to next if still have lives
        }
    }

    // Update UI safely
    if (ui) {
        if (ui.scoreText) ui.scoreText.setText(`Score: ${gameState.score}`);
        if (ui.streakText) ui.streakText.setText(`Streak: ${gameState.streak} (${gameState.multiplier}x)`);
    }
}

// Update updateTimer function to use the simple timerText
function updateTimer() {
    if (gameState.isPaused) return;

    gameState.timeLeft--;
    if (timerText) {  // Use the simple timerText instead of ui.timerText
        timerText.setText(`${gameState.timeLeft}s`);
    }

    if (gameState.timeLeft <= 0) {
        endGame.call(this);
    }
}

function startTimer(scene) {
    if (gameState.timer) {
        scene.time.removeEvent(gameState.timer);
    }

    gameState.timer = scene.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: scene,
        loop: true
    });
}

function togglePause(scene) {
    gameState.isPaused = !gameState.isPaused;
    const pauseText = pauseButton.list[1];
    pauseText.setText(gameState.isPaused ? 'RESUME' : 'PAUSE');

    if (gameState.isPaused) {
        // Pause game logic
        scene.time.paused = true;
        // Add pause overlay
        const overlay = scene.add.rectangle(
            config.width / 2,
            config.height / 2,
            config.width,
            config.height,
            0x000000,
            0.5
        );
        scene.add.text(config.width / 2, config.height / 2, 'PAUSED', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial',
            selectable: true
        }).setOrigin(0.5);
    } else {
        // Resume game logic
        scene.time.paused = false;
        // Remove pause overlay
        scene.children.list
            .filter(child => child.type === 'Rectangle' || child.text === 'PAUSED')
            .forEach(child => child.destroy());
    }
}

// Add power-up system
function addPowerUp(type) {
    const powerUps = {
        extraTime: () => gameState.timeLeft += 10,
        doublePoints: () => gameState.multiplier *= 2,
        extraLife: () => {
            gameState.lives = Math.min(5, gameState.lives + 1);
            updateLivesDisplay();
        }
    };

    if (powerUps[type]) {
        powerUps[type]();
    }
}

// Add new function after the togglePause function
function toggleMusic() {
    if (!bgMusic) return;

    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
        bgMusic.resume();
        if (musicButton) {
            musicButton.list[0].setFillStyle(0x4CAF50);
            musicButton.list[1].setText('MUSIC ON');
        }
    } else {
        bgMusic.pause();
        if (musicButton) {
            musicButton.list[0].setFillStyle(0x666666);
            musicButton.list[1].setText('MUSIC OFF');
        }
    }
}