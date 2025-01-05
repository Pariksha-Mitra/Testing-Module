import { POST } from "@/app/api/school/register/route";
import { connectDb } from "@/utils/db";
import { schoolSchema } from "@/models/schoolSchema";
import SchoolModel from "@/models/schoolModel";
import { createId } from "@paralleldrive/cuid2";
import { NextRequest, NextResponse } from "next/server";

jest.mock("@/utils/db", () => ({
  connectDb: jest.fn(),
}));

jest.mock("@paralleldrive/cuid2", () => ({
  createId: jest.fn(() => "uniqueString123"),
}));

jest.mock("@/models/schoolModel", () => ({
  create: jest.fn(),
}));

describe("POST /school", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRequest = (body: Record<string, any>) => {
    return {
      body,
      json: jest.fn(),
    } as unknown as NextRequest;
  };

  const mockNextResponse = () => {
    const json = jest.fn();
    return {
      json,
      status: jest.fn(),
    } as unknown as NextResponse;
  };

  it("should connect to the database", async () => {
    const validSchoolData = {
      name: "Sunrise Academy",
      contact: "1234567890",
      address: "456 Elm St",
    };

    const req = mockRequest(validSchoolData);
    await POST(req);

    expect(connectDb).toHaveBeenCalledTimes(1);
  });

  it("should generate a unique school ID", async () => {
    const validSchoolData = {
      name: "Sunrise Academy",
      contact: "1234567890",
      address: "456 Elm St",
    };

    (schoolSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: validSchoolData,
    });

    const req = mockRequest(validSchoolData);
    await POST(req);

    expect(createId).toHaveBeenCalledTimes(1);
    expect(createId).toHaveBeenCalledWith(); 
  });

  it("should throw an error if the school name is missing", async () => {
    const invalidSchoolData = {
      contact: "1234567890",
      address: "456 Elm St",
    };

    (schoolSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: { message: "Validation failed: Name is required" },
    });

    const req = mockRequest(invalidSchoolData);
    const res = await POST(req);

    expect(res).toEqual(
      expect.objectContaining({
        json: expect.objectContaining({
          message: "Validation failed: Name is required",
        }),
        status: 500,
      })
    );
  });

  it("should handle duplicate school entries", async () => {
    const validSchoolData = {
      name: "Sunrise Academy",
      contact: "1234567890",
      address: "456 Elm St",
    };

    const duplicateError = new Error("E11000 duplicate key error collection");

    (schoolSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: validSchoolData,
    });

    (SchoolModel.create as jest.Mock).mockRejectedValue(duplicateError);

    const req = mockRequest(validSchoolData);
    const res = await POST(req);

    expect(res).toEqual(
      expect.objectContaining({
        json: expect.objectContaining({
          message: duplicateError.message,
        }),
        status: 500,
      })
    );
  });

  it("should handle missing request body gracefully", async () => {
    const req = mockRequest({}); 

    const res = await POST(req);

    expect(res).toEqual(
      expect.objectContaining({
        json: expect.objectContaining({
          message: "Request body is required",
        }),
        status: 400,
      })
    );
  });

  it("should handle network/database connection issues", async () => {
    const validSchoolData = {
      name: "Sunrise Academy",
      contact: "1234567890",
      address: "456 Elm St",
    };

    const connectionError = new Error("Failed to connect to the database");

    (connectDb as jest.Mock).mockRejectedValue(connectionError);

    const req = mockRequest(validSchoolData);
    const res = await POST(req);

    expect(res).toEqual(
      expect.objectContaining({
        json: expect.objectContaining({
          message: connectionError.message,
        }),
        status: 500,
      })
    );
  });

  it("should return success even with extra fields in the request body", async () => {
    const validSchoolData = {
      name: "Sunrise Academy",
      contact: "1234567890",
      address: "456 Elm St",
      extraField: "This should be ignored",
    };

    const mockSchool = {
      save: jest.fn(),
    };

    (schoolSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        name: validSchoolData.name,
        contact: validSchoolData.contact,
        address: validSchoolData.address,
      },
    });

    (SchoolModel.create as jest.Mock).mockReturnValue(mockSchool);

    const req = mockRequest(validSchoolData);
    const res = await POST(req);

    expect(res).toEqual(
      expect.objectContaining({
        json: expect.objectContaining({
          message: "School Added",
          success: true,
        }),
      })
    );
  });

  it("should log error details for debugging purposes", async () => {
    const validSchoolData = {
      name: "Sunrise Academy",
      contact: "1234567890",
      address: "456 Elm St",
    };

    const unexpectedError = new Error("Something went wrong!");

    console.error = jest.fn();

    (schoolSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: validSchoolData,
    });

    (SchoolModel.create as jest.Mock).mockRejectedValue(unexpectedError);

    const req = mockRequest(validSchoolData);
    await POST(req);

    expect(console.error).toHaveBeenCalledWith(unexpectedError);
  });

  it("should ensure school ID has a specific format", async () => {
    const validSchoolData = {
      name: "Sunrise Academy",
      contact: "1234567890",
      address: "456 Elm St",
    };

    const schoolId = "SA-uniqueS";

    (schoolSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: validSchoolData,
    });

    (createId as jest.Mock).mockReturnValue("uniqueString123");

    const req = mockRequest(validSchoolData);
    await POST(req);

    expect(SchoolModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        schoolId: schoolId,
      })
    );
  });
});
