import { POST } from "@/app/api/register/route";
import SchoolModel from "@/models/schoolModel";
import UserModel from "@/models/user.model";
import { ROLE } from "@/utils/types";
import bcrypt from "bcryptjs";

jest.mock("@/utils/db", () => ({
  connectDb: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("@/models/user.model", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("@/models/schoolModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

interface MockUser {
  save: () => Promise<any>;
  [key: string]: any;
}

describe("Register API", () => {
  const mockUser: MockUser = {
    save: jest.fn().mockResolvedValue(undefined),
  };

  const mockTeacherData = {
    firstName: "John",
    middleName: "",
    surname: "Doe",
    dateOfBirth: "1990-01-01",
    role: ROLE.Teacher,
    schoolId: "school123",
    email: "john@example.com",
    invitationId: "inv123",
  };

  const mockStudentData = {
    firstName: "Jane",
    middleName: "",
    surname: "Smith",
    dateOfBirth: "2010-01-01",
    role: ROLE.Student,
    schoolId: "school123",
    email: "jane@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (SchoolModel.findOne as jest.Mock).mockResolvedValue({ schoolId: "school123" });
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (UserModel.create as jest.Mock).mockImplementation((data: any) => ({
      ...mockUser,
      ...data,
    }));
  });

  it("registers teacher successfully", async () => {
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockTeacherData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(UserModel.create).toHaveBeenCalledTimes(1);
  });

  it("registers student successfully", async () => {
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockStudentData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(UserModel.create).toHaveBeenCalledTimes(1);
  });

  it("returns 404 for invalid school", async () => {
    (SchoolModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockTeacherData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe("Invalid School id or School is not registered");
  });

  it("returns 409 for existing user", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce({ exists: true });
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockTeacherData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe("User already exists, login instead.");
  });

  it("handles validation errors", async () => {
    const invalidData = { firstName: "John" };
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Validation failed!");
  });

  it("handles database errors", async () => {
    (UserModel.create as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockTeacherData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("DB Error");
  });
});