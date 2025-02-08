import mongoose, { Document, Model, Schema } from "mongoose";

enum GameDifficultyEnum {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

enum GameStatusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

interface IGame extends Document {
    title: string;
    standard: number;
    subject: string;
    chapter: string;
    exercise: number;
    description: string;
    difficulty: GameDifficultyEnum;
    timeLimit: number;
    status: GameStatusEnum;
    numberLevels: number;
}

const gameSchema: Schema<IGame> = new Schema<IGame>(
    {
        title: {
            type: String,
            required: [true, "Game Title is required"],
            trim: true,
            maxLength: [100, "Game Title must be less than 100 characters"],
        },
        standard: {
            type: Number,
            required: [true, "Standard is required"],
            min: [1, "Standard must be at least 1"],
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
        },
        chapter: {
            type: String,
            required: [true, "Chapter is required"],
        },
        exercise: {
            type: Number,
            required: [true, "Exercise number is required"],
        },
        description: {
            // (Optional)
            type: String,
        },
        difficulty: {
            type: String,
            enum: GameDifficultyEnum,
            default: GameDifficultyEnum.MEDIUM,
        },
        timeLimit: {
            type: Number, // Time limit in seconds for completing the game
            min: [0, "Time limit must be a positive number"],
        },
        status: {
            //current state of the game
            type: String,
            enum: GameStatusEnum,
            default: GameStatusEnum.ACTIVE,
        },
        numberLevels: {
            //Total number of levels
            type: Number,
            required: [true, "Number of levels is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const Game: Model<IGame> =
    mongoose.models.Game || mongoose.model<IGame>("Game", gameSchema);
