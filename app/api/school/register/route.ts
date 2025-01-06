import SchoolModel from "@/models/schoolModel";
import { schoolSchema } from "@/models/schoolSchema";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";


/**
 * @swagger
 * /api/school/register:
 *   post:
 *     tags: [School]
 *     summary: Register a new school
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: School added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 * /api/school:
 *   get:
 *     tags: [School]
 *     summary: Get all schools or a specific school by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID of the school to retrieve
 *     responses:
 *       200:
 *         description: List of all schools or the specified school
 *       404:
 *         description: School not found
 *       500:
 *         description: Internal server error
 * /api/school/update:
 *   put:
 *     tags: [School]
 *     summary: Update a school's details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: School updated successfully
 *       400:
 *         description: Request body or ID missing
 *       404:
 *         description: School not found
 *       500:
 *         description: Internal server error
 * /api/school/delete:
 *   delete:
 *     tags: [School]
 *     summary: Delete a school by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       400:
 *         description: ID is required
 *       404:
 *         description: School not found
 *       500:
 *         description: Internal server error
 */



export const generateSchoolId = (name: string) => {
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
  const randomString = createId().slice(0, 6);
  return `${initials}-${randomString}`;
};

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { message: "Request body is required" },
        { status: 400 }
      );
    }

    const validation = schoolSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.message },
        { status: 500 }
      );
    }

    const schoolId = generateSchoolId(validation.data.name);

    const school = await SchoolModel.create({
      name: validation.data.name,
      contact: validation.data.contact,
      address: validation.data.address,
      schoolId,
    });

    await school.save();

    return NextResponse.json({
      message: "School Added",
      success: true,
      id: schoolId,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Unknown error occurred",
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      const schools = await SchoolModel.find();
      return NextResponse.json({
        message: "All schools",
        schools,
      });
    }

    const school = await SchoolModel.findById(id);

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "School found",
      school,
    }, {
      status : 201
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Unknown error occurred",
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();

    if (!body || !body.id) {
      return NextResponse.json(
        { message: "Request body and ID are required" },
        { status: 400 }
      );
    }

    const validation = schoolSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.message },
        { status: 500 }
      );
    }

    const updatedSchool = await SchoolModel.findByIdAndUpdate(
      body.id,
      validation.data,
      { new: true }
    );

    if (!updatedSchool) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "School Updated",
      success: true,
      school: updatedSchool,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
          error: {},
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Unknown error occurred",
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const deletedSchool = await SchoolModel.findByIdAndDelete(id);

    if (!deletedSchool) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "School Deleted",
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
          error: {},
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Unknown error occurred",
        error: error,
      },
      { status: 500 }
    );
  }
}
