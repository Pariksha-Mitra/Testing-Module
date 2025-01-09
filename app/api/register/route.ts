import { registerSchema } from "@/models/registerSchema";
import userModel from "@/models/user.model";
import { ROLE } from "@/utils/types";
import { connectDB } from "@/utils/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/utils/api-error";

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               surname:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               role:
 *                 type: string
 *                 enum: [teacher, student]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      firstName,
      middleName,
      surname,
      dateOfBirth,
      role,
      schoolId,
      email,
      invitationId,
    } = await req.json();

    const slug =
      `${firstName}-${surname}-${dateOfBirth}-${schoolId}`.toLowerCase();

    const validationData = {
      firstName,
      middleName,
      surname,
      slug,
      dateOfBirth,
      role,
      schoolId,
      ...(role === ROLE.Teacher ? { email, invitationId } : {}),
    };

    const validation = registerSchema.safeParse(validationData);

    if (!validation.success) {
      throw new ApiError(400, "Validation failed", validation.error.format());
    }

    const existingUser = await userModel.findOne({
      slug,
    });

    if (existingUser) {
      throw new ApiError(409, "User already exists, login instead.");
    }

    const username = `${firstName.toLowerCase()}@${Math.floor(
      Math.random() * 10000
    )}`;
    const hashedPassword = await bcrypt.hash(username, 12);

    const dateOfBirthDate = new Date(dateOfBirth + "T00:00:00Z");

    let userData;
    if (email) {
      userData = {
        firstName,
        middleName,
        surname,
        slug,
        dateOfBirth: dateOfBirthDate,
        role,
        schoolId,
        username,
        password: hashedPassword,
        ...(role === ROLE.Teacher
          ? {
              email: email,
              invitationId,
            }
          : {}),
      };
    } else {
      userData = {
        firstName,
        middleName,
        surname,
        slug,
        dateOfBirth: dateOfBirthDate,
        role,
        schoolId,
        username,
        password: hashedPassword,
      };
    }

    const result = await userModel.create(userData);

    await result.save();

    return NextResponse.json(
      {
        message: "User registered successfully!",
        user: result,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
