import { POST } from "@/app/api/register/route";
import { connectDb } from "@/utils/db";
import { ROLE } from "@/utils/types";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  models: {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/utils/db", () => ({
  connectDb: jest.fn(),
}));

jest.mock("bcrypt");

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      status: options?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("POST /api/register", () => {
  const mockTeacherData = {
    firstName: "John",
    middleName: "Middle",
    surname: "Doe",
    dateOfBirth: "1990-01-01",
    role: ROLE.Teacher,
    schoolId: "school123",
    email: "john@example.com",
    invitationId: "inv123",
  };

  const mockStudentData = {
    firstName: "Jane",
    surname: "Smith",
    dateOfBirth: "2010-01-01",
    role: ROLE.Student,
    schoolId: "school123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");
    (connectDb as jest.Mock).mockResolvedValue(undefined);
    const mockSave = jest.fn().mockResolvedValue(undefined);
    const mockUserDocument = { save: mockSave };
    (mongoose.models.User.findOne as jest.Mock).mockResolvedValue(null);
    (mongoose.models.User.create as jest.Mock).mockImplementation((data) => ({
      ...data,
      ...mockUserDocument,
    }));
  });

  it("should successfully register a teacher", async () => {
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockTeacherData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe("User registered successfully!");
    expect(mongoose.models.User.create).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it("should successfully register a student", async () => {
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockStudentData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe("User registered successfully!");
    expect(mongoose.models.User.create).toHaveBeenCalled();
  });

  it("should reject registration with missing required fields", async () => {
    const invalidData = {
      firstName: "John",
    };

    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Validation failed!");
  });

  it("should reject registration for existing user", async () => {
    (mongoose.models.User.findOne as jest.Mock).mockResolvedValueOnce({
      _id: "existingUserId",
    });

    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockTeacherData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.message).toBe("User already exists, login instead.");
  });

  // it("should handle database connection errors", async () => {
  //   (connectDb as jest.Mock).mockImplementation(() => {
  //     throw new Error("Database connection failed");
  //   });

  //   const request = new Request("http://localhost:3000/api/register", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(mockTeacherData),
  //   });

  //   const response = await POST(request);
  //   const data = await response.json();

  //   expect(response.status).toBe(500);
  //   expect(data).toEqual({
  //     message: "Signup failed!",
  //     success: false,
  //     error: "Database connection failed",
  //   });
  //   expect(connectDb).toHaveBeenCalled();
  // });

  it("should handle database operation errors", async () => {
    (mongoose.models.User.create as jest.Mock).mockRejectedValue(
      new Error("Database operation failed")
    );

    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockTeacherData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: "Signup failed!",
      success: false,
      error: "Database operation failed",
    });
  });

  it("should generate correct username format", async () => {
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockTeacherData),
    });

    await POST(request);

    const createCall = (mongoose.models.User.create as jest.Mock).mock.calls[0][0];
    expect(createCall.username).toMatch(/^john@\d{1,4}$/);
    expect(createCall.password).toBe("hashedPassword123");
  });
});