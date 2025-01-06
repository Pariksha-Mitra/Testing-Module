import userModel from "@/models/user.model";
import { ApiError, handleApiError } from "@/utils/api-error";
import { connectDb } from "@/utils/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      throw new ApiError(400, "Token and new password are required");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return Response.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
