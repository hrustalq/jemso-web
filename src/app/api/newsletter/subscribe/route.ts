import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { db } from "~/server/db";
import { subscribeNewsletterDto } from "~/server/api/routers/blog/dto/newsletter.dto";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    
    // Validate input
    const validatedInput = subscribeNewsletterDto.parse(body);
    const { email, name } = validatedInput;

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active && existing.confirmedAt) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }

      // Reactivate subscription
      const updated = await db.newsletterSubscriber.update({
        where: { email },
        data: {
          active: true,
          unsubscribedAt: null,
          name: name ?? existing.name,
        },
      });

      return NextResponse.json(updated, { status: 200 });
    }

    // Create new subscription
    const subscriber = await db.newsletterSubscriber.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid input data", 
          details: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}

