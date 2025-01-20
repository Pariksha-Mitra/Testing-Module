import mongoose, { Document, Model, Schema } from "mongoose";

enum RewardTypeEnum {
    BADGE = "BADGE",
    POINTS = "POINTS",
    TROPHY = "TROPHY",
}

interface IGameProgress extends Document {
    playerId: string;
    gameId: string;
    current_lvl: number;
    rank: number;
    score: number;
    attempts: number;
    time_taken: number;
    completedAt: Date;
    rewardType: RewardTypeEnum;
    awardedAt: Date;
}

const gameProgressSchema: Schema<IGameProgress> = new Schema<IGameProgress>(
    {
        playerId: {
            type: String,
            required: [true, "Player ID is required."],
        },
        gameId: {
            type: String,
            required: [true, "Game ID is required."],
        },
        current_lvl: {
            type: Number, //Shows the current level of the player
            required: [true, "Current level is required."],
        },
        rank: {
            type: Number, //Can be displayed on a leadership board
            min: [0, "Rank must be a non-negative number."],
        },
        score: {
            type: Number,
            default: 0,
            min: [0, "Score cannot be negative."],
        },
        attempts: {
            type: Number,
            default: 0,
            min: [0, "Attempts cannot be negative."],
        },
        time_taken: {
            type: Number, //Time taken to complete the game in seconds
            default: 0,
            min: [0, "Time taken cannot be negative."],
        },
        completedAt: {
            type: Date,
        },
        rewardType: {
            type: String,
            enum: RewardTypeEnum,
        },
        awardedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const GameProgress: Model<IGameProgress> =
    mongoose.models.GameProgress ||
    mongoose.model<IGameProgress>("GameProgress", gameProgressSchema);
