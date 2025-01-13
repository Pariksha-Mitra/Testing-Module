import crypto from 'crypto';
import nodemailer from 'nodemailer';
import userModel from '@/models/user.model';
import { ApiError, handleApiError } from '@/utils/api-error';
import { connectDb } from '@/utils/db';

// Create reusable transporter object using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    await connectDb();
    const { email } = await req.json();

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate reset token with expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token info
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/new-password?token=${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Reset Your Password",
      // Add html template
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

    return Response.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
