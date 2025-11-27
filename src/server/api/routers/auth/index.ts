import { TRPCError } from "@trpc/server";
import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  signUpDto,
  signUpOutputDto,
  type SignUpOutputDto,
} from "./dto/sign-up.dto";
import {
  signInDto,
  signInOutputDto,
  type SignInOutputDto,
} from "./dto/sign-in.dto";
import {
  forgotPasswordDto,
  forgotPasswordOutputDto,
  type ForgotPasswordOutputDto,
} from "./dto/forgot-password.dto";
import {
  resetPasswordDto,
  resetPasswordOutputDto,
  verifyResetTokenDto,
  verifyResetTokenOutputDto,
  type ResetPasswordOutputDto,
  type VerifyResetTokenOutputDto,
} from "./dto/reset-password.dto";

// Helper function to generate secure random token
function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

// Helper function to send password reset email (placeholder for now)
async function sendPasswordResetEmail(
  email: string,
  token: string,
  name?: string | null
): Promise<void> {
  // In production, integrate with email service (SendGrid, Resend, etc.)
  // For now, log to console
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  console.log(`
========================================
Password Reset Email
========================================
To: ${email}
Name: ${name ?? "User"}
Reset URL: ${resetUrl}
========================================
`);
}

// Helper function to send welcome email (placeholder)
async function sendWelcomeEmail(
  email: string,
  name?: string | null
): Promise<void> {
  console.log(`
========================================
Welcome Email
========================================
To: ${email}
Name: ${name ?? "New User"}
Welcome to Jemso!
========================================
`);
}

export const authRouter = createTRPCRouter({
  /**
   * Sign up a new user with email and password
   */
  signUp: publicProcedure
    .input(signUpDto)
    .output(signUpOutputDto)
    .mutation(async ({ ctx, input }): Promise<SignUpOutputDto> => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await hash(password, 12);

      // Create user with default "user" role
      const user = await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name ?? null,
          emailVerified: new Date(), // Auto-verify for now, can add email verification later
        },
      });

      // Assign default "user" role
      const userRole = await ctx.db.role.findUnique({
        where: { slug: "user" },
      });

      if (userRole) {
        await ctx.db.userRole.create({
          data: {
            userId: user.id,
            roleId: userRole.id,
          },
        });
      }

      // Send welcome email
      await sendWelcomeEmail(user.email!, user.name);

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        createdAt: user.createdAt,
      };
    }),

  /**
   * Sign in with email and password (for credentials check)
   * Note: Actual session creation is handled by NextAuth
   */
  signIn: publicProcedure
    .input(signInDto)
    .output(signInOutputDto)
    .mutation(async ({ ctx, input }): Promise<SignInOutputDto> => {
      const { email, password } = input;

      // Find user
      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      if (!user?.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Verify password
      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      return {
        user: {
          id: user.id,
          email: user.email!,
          name: user.name,
        },
        message: "Sign in successful",
      };
    }),

  /**
   * Request password reset - generates token and sends email
   */
  forgotPassword: publicProcedure
    .input(forgotPasswordDto)
    .output(forgotPasswordOutputDto)
    .mutation(async ({ ctx, input }): Promise<ForgotPasswordOutputDto> => {
      const { email } = input;

      // Find user
      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      // Always return success to prevent email enumeration
      if (!user) {
        return {
          message:
            "If an account exists with this email, you will receive a password reset link.",
          email,
        };
      }

      // Generate reset token
      const token = generateResetToken();
      const expires = new Date(Date.now() + 3600000); // 1 hour from now

      // Invalidate any existing tokens for this user
      await ctx.db.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          used: false,
          expires: { gt: new Date() },
        },
        data: { used: true },
      });

      // Create new reset token
      await ctx.db.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expires,
        },
      });

      // Send password reset email
      await sendPasswordResetEmail(user.email!, token, user.name);

      return {
        message:
          "If an account exists with this email, you will receive a password reset link.",
        email,
      };
    }),

  /**
   * Verify reset token validity
   */
  verifyResetToken: publicProcedure
    .input(verifyResetTokenDto)
    .output(verifyResetTokenOutputDto)
    .query(async ({ ctx, input }): Promise<VerifyResetTokenOutputDto> => {
      const { token } = input;

      const resetToken = await ctx.db.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      // Check if token exists, is not used, and not expired
      if (
        !resetToken ||
        resetToken.used ||
        resetToken.expires < new Date()
      ) {
        return { valid: false };
      }

      return {
        valid: true,
        email: resetToken.user.email!,
      };
    }),

  /**
   * Reset password using valid token
   */
  resetPassword: publicProcedure
    .input(resetPasswordDto)
    .output(resetPasswordOutputDto)
    .mutation(async ({ ctx, input }): Promise<ResetPasswordOutputDto> => {
      const { token, password } = input;

      // Find and validate token
      const resetToken = await ctx.db.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (
        !resetToken ||
        resetToken.used ||
        resetToken.expires < new Date()
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired reset token",
        });
      }

      // Hash new password
      const hashedPassword = await hash(password, 12);

      // Update user password and mark token as used
      await ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: resetToken.userId },
          data: { password: hashedPassword },
        }),
        ctx.db.passwordResetToken.update({
          where: { id: resetToken.id },
          data: { used: true },
        }),
      ]);

      return {
        message: "Password has been reset successfully",
      };
    }),
});

