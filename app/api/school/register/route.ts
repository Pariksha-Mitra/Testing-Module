import SchoolModel from "@/models/schoolModel";
import { schoolSchema } from "@/models/schoolSchema";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";

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
