import { generateSchoolId, POST } from "@/app/api/school/register/route";
import SchoolModel from "@/models/schoolModel";
import { schoolSchema } from "@/models/schoolSchema";
import { connectDb } from "@/utils/db";
import { NextRequest } from "next/server";

jest.mock("@/utils/db", () => ({
  connectDb: jest.fn(),
}));

jest.mock("@/models/schoolModel", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

jest.mock("@/models/schoolSchema", () => ({
  schoolSchema: {
    safeParse: jest.fn(),
  },
}));

jest.mock("@paralleldrive/cuid2", () => ({
  createId: jest.fn(() => "mocked"),
}));

const createMockRequest = (body: any): NextRequest => {
  return {
    json: () => Promise.resolve(body),
  } as unknown as NextRequest;
};

describe("POST /api/school/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (connectDb as jest.Mock).mockResolvedValue(undefined);
  });

  describe("Successful school registration", () => {
    it("should successfully register a new school", async () => {
      const validSchoolData = {
        name: "Test School",
        contact: "1234567890",
        address: "123 Test St",
      };

      const mockSchool = {
        save: jest.fn().mockResolvedValue(true),
      };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: validSchoolData,
      });

      (SchoolModel.create as jest.Mock).mockResolvedValue(mockSchool);

      const response = await POST(createMockRequest(validSchoolData));
      const responseData = await response.json();

      expect(connectDb).toHaveBeenCalled();

      const expectedCreateData = {
        ...validSchoolData,
        schoolId: "TS-mocked",
      };

      expect(SchoolModel.create).toHaveBeenCalledWith(expectedCreateData);

      expect(responseData).toEqual({
        message: "School Added",
        success: true,
        id: "TS-mocked",
      });
    });

    it("should ignore extra fields in the request body", async () => {
      const validDataWithExtraField = {
        name: "Test School",
        contact: "1234567890",
        address: "123 Test St",
        extraField: "Should be ignored",
      };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {
          name: "Test School",
          contact: "1234567890",
          address: "123 Test St",
        },
      });

      const mockSchool = {
        save: jest.fn().mockResolvedValue(true),
      };

      (SchoolModel.create as jest.Mock).mockResolvedValue(mockSchool);

      const response = await POST(createMockRequest(validDataWithExtraField));
      const responseData = await response.json();

      expect(SchoolModel.create).toHaveBeenCalledWith({
        name: "Test School",
        contact: "1234567890",
        address: "123 Test St",
        schoolId: "TS-mocked",
      });

      expect(responseData).toEqual({
        message: "School Added",
        success: true,
        id: "TS-mocked",
      });
    });
  });

  describe("Validation handling", () => {
    it("should handle missing request body", async () => {
      const response = await POST(createMockRequest(null));
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 400,
        })
      );

      expect(responseData).toEqual({
        message: "Request body is required",
      });
    });

    it("should handle validation errors", async () => {
      const invalidData = {
        contact: "1234567890",
        address: "123 Test St",
      };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: {
          message: "Validation failed: Name is required",
        },
      });

      const response = await POST(createMockRequest(invalidData));
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 500,
        })
      );

      expect(responseData).toEqual({
        message: "Validation failed: Name is required",
      });
    });

    it("should handle validation errors with multiple missing fields", async () => {
      const incompleteData = {
        contact: "1234567890",
      };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: {
          message: "Validation failed: Name and Address are required",
        },
      });

      const response = await POST(createMockRequest(incompleteData));
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 500,
        })
      );

      expect(responseData).toEqual({
        message: "Validation failed: Name and Address are required",
      });
    });
  });

  describe("Error handling", () => {
    it("should handle database connection errors", async () => {
      const validData = {
        name: "Test School",
        contact: "1234567890",
        address: "123 Test St",
      };

      const connectionError = new Error("Database connection failed");
      (connectDb as jest.Mock).mockRejectedValue(connectionError);

      const response = await POST(createMockRequest(validData));
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 500,
        })
      );

      expect(responseData).toEqual({
        message: "Database connection failed",
        error: {},
      });
    });

    it("should handle duplicate school error", async () => {
      const validData = {
        name: "Test School",
        contact: "1234567890",
        address: "123 Test St",
      };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: validData,
      });

      const duplicateError = new Error("E11000 duplicate key error collection");
      (SchoolModel.create as jest.Mock).mockRejectedValue(duplicateError);

      const response = await POST(createMockRequest(validData));
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 500,
        })
      );

      expect(responseData).toEqual({
        message: "E11000 duplicate key error collection",
        error: {},
      });
    });

    it("should handle save operation errors", async () => {
      const validData = {
        name: "Test School",
        contact: "1234567890",
        address: "123 Test St",
      };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: validData,
      });

      const mockSchool = {
        save: jest.fn().mockRejectedValue(new Error("Save operation failed")),
      };

      (SchoolModel.create as jest.Mock).mockResolvedValue(mockSchool);

      const response = await POST(createMockRequest(validData));
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 500,
        })
      );

      expect(responseData).toEqual({
        message: "Save operation failed",
        error: {},
      });
    });

    it("should handle unknown errors", async () => {
      const validData = {
        name: "Test School",
        contact: "1234567890",
        address: "123 Test St",
      };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: validData,
      });

      (SchoolModel.create as jest.Mock).mockRejectedValue("Unknown error");

      const response = await POST(createMockRequest(validData));
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 500,
        })
      );

      expect(responseData).toEqual({
        message: "Unknown error occurred",
        error: "Unknown error",
      });
    });
  });

  describe("Utility functions", () => {
    it("should generate a valid schoolId for given school name", async () => {
      const name = "Modern School";
      const generatedId = generateSchoolId(name);
      expect(generatedId).toMatch(/^MS-\w{6}$/);
    });

    it("should handle invalid JSON payloads", async () => {
      const createMockInvalidRequest = (): NextRequest =>
        ({
          json: jest.fn().mockRejectedValue(new Error("Unexpected token")),
        } as unknown as NextRequest);

      const response = await POST(createMockInvalidRequest());
      const responseData = await response.json();

      expect(response).toEqual(
        expect.objectContaining({
          status: 500,
        })
      );

      expect(responseData).toEqual({
        message: "Unexpected token",
        error: {},
      });
    });
  });
});
