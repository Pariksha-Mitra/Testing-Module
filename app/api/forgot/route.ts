import userModel from "@/models/user.model";
import { connectDb } from "@/utils/db";
import crypto from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service : "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request): Promise<NextResponse> {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    await connectDb();

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiration = new Date(Date.now() + 3600000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/new-password?token=${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `
            <h1 style="font-family: Arial, sans-serif; color: #333333; font-size: 24px; margin-bottom: 20px;">
            Reset Your Password
            </h1>
            <p style="font-family: Arial, sans-serif; color: #555555; font-size: 16px; margin-bottom: 10px;">
            Click the link below to reset your password:
            </p>
            <a
            href="${resetUrl}"
            style="
                font-family: Arial, sans-serif;
                color: #ffffff;
                background-color: #007bff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                display: inline-block;
            "
            >
            Reset Password
            </a>
            <p style="font-family: Arial, sans-serif; color: #555555; font-size: 16px; margin-top: 20px;">
            This link will expire in 1 hour.
            </p>`,
    });

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password handler:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
