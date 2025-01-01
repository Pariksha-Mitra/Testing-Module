import userModel from "@/models/user.model";
import { connectDb } from "@/utils/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse
      .json({ message: "Token and new password are required." },{
        status : 400
      });
  }

  try {
    await connectDb();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token." }, {
        status : 400
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse
      .json({ message: "Password has been reset successfully." }, {
        status : 200
      });
  } catch (error) {
    console.error("Error in reset password handler:", error);
    return NextResponse.json({ message: "An error occurred." }, {
        status : 500
    });
  }
}
