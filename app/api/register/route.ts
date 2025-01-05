import { registerSchema } from "@/models/registerSchema";
import userModel from "@/models/user.model";
import { ROLE } from "@/utils/types";
import { connectDb } from "@/utils/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

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
  await connectDb();
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

  await connectDb();

  try {
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
      return NextResponse.json(
        {
          message: "Validation failed!",
          success: false,
          error: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const existingUser = await userModel.findOne({
      slug,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists, login instead.",
          success: false,
        },
        { status: 409 }
      );
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
              email: email || null,
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
    // console.log("SignUp error");
    return NextResponse.json(
      {
        message: "Signup failed!",
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred, something went wrong.",
      },
      { status: 500 }
    );
  }
}
