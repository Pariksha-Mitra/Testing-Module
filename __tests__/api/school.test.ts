import { POST, GET, PUT, DELETE } from "@/app/api/school/route";
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
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("@/models/schoolSchema", () => ({
  schoolSchema: {
    safeParse: jest.fn(),
  },
}));

const createMockRequest = (body: any, url = "http://localhost/api/school"): NextRequest => {
  return {
    json: () => Promise.resolve(body),
    url,
  } as unknown as NextRequest;
};

describe("API /api/school", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (connectDb as jest.Mock).mockResolvedValue(undefined);
  });


  describe("POST /api/school", () => {
    it("should successfully create a new school", async () => {
      const validSchoolData = { name: "Test School", contact: "1234567890", address: "Test Address" };
      const mockSchool = { id: "123", save: jest.fn().mockResolvedValue(true) };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: validSchoolData });
      (SchoolModel.create as jest.Mock).mockResolvedValue(mockSchool);

      const response = await POST(createMockRequest(validSchoolData));
      const responseData = await response.json();

      expect(connectDb).toHaveBeenCalled();
      expect(SchoolModel.create).toHaveBeenCalledWith(validSchoolData);
      expect(responseData).toEqual({
        message: "School Added",
        success: true,
        id: "123",
      });
    });

    it("should handle validation errors", async () => {
      (schoolSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { message: "Validation failed" },
      });

      const response = await POST(createMockRequest({}));
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({ message: "Validation failed" });
    });

    it("should handle missing body", async () => {
      const response = await POST(createMockRequest(null));
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({ message: "Request body is required" });
    });
    describe("Edge cases", () => {
      it("should handle extra fields gracefully", async () => {
        const validDataWithExtraField = {
          name: "Test School",
          contact: "1234567890",
          address: "123 Test St",
          extraField: "Ignored",
        };
  
        const mockSchool = {
          save: jest.fn().mockResolvedValue(true),
          id: "mockedId",
        };
  
        (schoolSchema.safeParse as jest.Mock).mockReturnValue({
          success: true,
          data: {
            name: "Test School",
            contact: "1234567890",
            address: "123 Test St",
          },
        });
  
        (SchoolModel.create as jest.Mock).mockResolvedValue(mockSchool);
  
        const response = await POST(createMockRequest(validDataWithExtraField));
        const responseData = await response.json();
  
        expect(SchoolModel.create).toHaveBeenCalledWith({
          name: "Test School",
          contact: "1234567890",
          address: "123 Test St",
        });
  
        expect(responseData).toEqual({
          message: "School Added",
          success: true,
          id: "mockedId",
        });
      });
  
      it("should handle unexpected errors", async () => {
        (connectDb as jest.Mock).mockImplementation(() => {
          throw new Error("Unexpected error");
        });
  
        const validSchoolData = {
          name: "Test School",
          contact: "1234567890",
          address: "123 Test St",
        };
  
        const response = await POST(createMockRequest(validSchoolData));
        const responseData = await response.json();
  
        expect(response).toEqual(
          expect.objectContaining({
            status: 500,
          })
        );
  
        expect(responseData).toEqual({
          message: "Unexpected error",
          error: expect.any(Object),
        });
      });
    });
  });

  describe("GET /api/school", () => {
    it("should retrieve all schools", async () => {
      const mockSchools = [{ id: "1", name: "School 1" }, { id: "2", name: "School 2" }];
      (SchoolModel.find as jest.Mock).mockResolvedValue(mockSchools);

      const response = await GET(createMockRequest(null));
      const responseData = await response.json();

      expect(connectDb).toHaveBeenCalled();
      expect(SchoolModel.find).toHaveBeenCalled();
      expect(responseData).toEqual({ message: "All schools", schools: mockSchools });
    });

    it("should retrieve a school by ID", async () => {
      const mockSchool = { id: "1", name: "School 1" };
      (SchoolModel.findById as jest.Mock).mockResolvedValue(mockSchool);

      const response = await GET(createMockRequest(null, "http://localhost/api/school?id=1"));
      const responseData = await response.json();

      expect(SchoolModel.findById).toHaveBeenCalledWith("1");
      expect(responseData).toEqual({ message: "School found", school: mockSchool });
    });

    it("should return 404 if school not found", async () => {
      (SchoolModel.findById as jest.Mock).mockResolvedValue(null);

      const response = await GET(createMockRequest(null, "http://localhost/api/school?id=1"));
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData).toEqual({ message: "School not found" });
    });
  });

  describe("PUT /api/school", () => {
    it("should successfully update a school", async () => {
      const validData = { id: "1", name: "Updated School", contact: "1234567890", address: "New Address" };
      const updatedSchool = { ...validData };

      (schoolSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: validData });
      (SchoolModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedSchool);

      const response = await PUT(createMockRequest(validData));
      const responseData = await response.json();

      expect(SchoolModel.findByIdAndUpdate).toHaveBeenCalledWith("1", validData, { new: true });
      expect(responseData).toEqual({
        message: "School Updated",
        success: true,
        school: updatedSchool,
      });
    });

    it("should handle missing ID", async () => {
      const response = await PUT(createMockRequest({ name: "Updated School" }));
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({ message: "Request body and ID are required" });
    });

    it("should return 404 if school not found", async () => {
      (SchoolModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await PUT(createMockRequest({ id: "1", name: "Updated School" }));
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData).toEqual({ message: "School not found" });
    });
  });

  describe("DELETE /api/school", () => {
    it("should successfully delete a school", async () => {
      (SchoolModel.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      const response = await DELETE(createMockRequest({ id: "1" }));
      const responseData = await response.json();

      expect(SchoolModel.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(responseData).toEqual({
        message: "School Deleted",
        success: true,
      });
    });

    it("should handle missing ID", async () => {
      const response = await DELETE(createMockRequest({}));
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({ message: "ID is required" });
    });

    it("should return 404 if school not found", async () => {
      (SchoolModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await DELETE(createMockRequest({ id: "1" }));
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData).toEqual({ message: "School not found" });
    });
  });
});
