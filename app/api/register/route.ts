import bcrypt from "bcrypt";
import SchoolModel from "@/models/schoolSchema";
import userModel from "@/models/user.model";
import { ApiError, handleApiError } from "@/utils/api-error";
import { connectDb } from "@/utils/db";
import { NextResponse } from "next/server";
import { registerSchema } from "@/models/registerSchema";
import { ROLE } from "@/utils/types";

interface RegisterRequestBody {
  firstName: string;
  middleName?: string;
  surname: string;
  dateOfBirth: string;
  role: ROLE;
  schoolId: string;
  email?: string;
  invitationId?: string;
  rollNo?: number;
  division?: division;
}

enum division {
  A = "A",
  B = "B",
  C = "C",
}
/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Registers a new user as either a teacher or a student, linking them to a registered school.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *                 example: John
 *               middleName:
 *                 type: string
 *                 description: Middle name of the user (optional)
 *                 example: A
 *               surname:
 *                 type: string
 *                 description: Surname of the user
 *                 example: Doe
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth in YYYY-MM-DD format
 *                 example: 1995-08-15
 *               role:
 *                 type: string
 *                 enum: [teacher, student]
 *                 description: Role of the user, either teacher or student
 *                 example: teacher
 *               schoolId:
 *                 type: string
 *                 description: The ID of the school the user is associated with
 *                 example: ABC-123456
 *               email:
 *                 type: string
 *                 description: Email of the user (required for teachers)
 *                 example: john.doe@example.com
 *               invitationId:
 *                 type: string
 *                 description: Invitation ID for teacher registration (optional)
 *                 example: INVITE123
 *               rollNo:
 *                 type: number
 *                 description: Roll Number of the student
 *                 example: 2
 *               division:
 *                 type: string
 *                 description: Division of the student's class
 *                 example: C
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully!
 *                 user:
 *                   type: object
 *                   description: The registered user's details
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed!
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   description: Validation error details
 *       404:
 *         description: Invalid School ID or School not registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid School id or School is not registered
 *                 schoolId:
 *                   type: string
 *                   example: ABC-123456
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists, login instead.
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Signup failed due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signup failed!
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */

export async function POST(req: Request) {
  await connectDb();

  try {
    const {
      firstName,
      middleName,
      surname,
      dateOfBirth,
      role,
      schoolId,
      email,
      invitationId,
      rollNo,
      division,
    }: RegisterRequestBody = await req.json();

    const validSchoolId = await SchoolModel.findById(schoolId);

    if (!validSchoolId) {
      return NextResponse.json(
        {
          message: "Invalid School id or School is not registered",
          schoolId,
        },
        {
          status: 404,
        }
      );
    }

    if(invitationId && (invitationId !== process.env.INVITATION_ID)) {
      return NextResponse.json(
        {
          message: "Invalid invitation ID",
          invitationId,
        },
        {
          status: 404,
        }
      );
    }

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
      ...(role === ROLE.Student ? { rollNo, division } : {}),
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
        ...(role === ROLE.Student ? { rollNo, division } : {}),
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
