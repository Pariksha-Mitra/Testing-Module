import { schoolSchema } from "@/models/schoolSchema";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import SchoolModel from "@/models/schoolModel";

const generateSchoolId = (name: string) => {
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
  const randomString = createId().slice(0, 6);
  return `${initials}-${randomString}`;
};

export async function POST(req: NextRequest) {
  await connectDb();

  try {
    const body = req.body;

    const validation = schoolSchema.safeParse(body);

    if (!validation.success) throw new Error(validation.error.message);

    const schoolId = generateSchoolId(validation.data.name);

    const school = await SchoolModel.create({
        name : validation.data.name,
        contact : validation.data.contact,
        address : validation.data.address,
        schoolId
    })

    await school.save()

    return NextResponse.json({
        message : "School Added",
        success : true,
        id : schoolId
    })

  } catch (error) {
    if (error instanceof Error) {
      NextResponse.json(
        {
          message: error.message,
          error: error,
        },
        {
          status: 500,
        }
      );
    } else
      NextResponse.json({ message: "Unknown error occured", error: error });
  }
}
