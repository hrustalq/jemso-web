import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { db } from "~/server/db";
import { subscribeToCategoryDto } from "~/server/api/routers/blog/dto/newsletter.dto";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;
    
    // Validate input
    const validatedInput = subscribeToCategoryDto.parse(body);
    const { email, name, categoryId } = validatedInput;

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    let subscriber;
    
    if (existing) {
      // Update existing subscriber
      subscriber = await db.newsletterSubscriber.update({
        where: { email },
        data: {
          active: true,
          unsubscribedAt: null,
          name: name ?? existing.name,
        },
      });
    } else {
      // Create new subscriber
      subscriber = await db.newsletterSubscriber.create({
        data: {
          email,
          name,
        },
      });
    }

    // Add category preference
    await db.newsletterCategoryPreference.upsert({
      where: {
        subscriberId_categoryId: {
          subscriberId: subscriber.id,
          categoryId,
        },
      },
      update: {},
      create: {
        subscriberId: subscriber.id,
        categoryId,
      },
    });

    return NextResponse.json(subscriber, { status: 200 });
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
    console.error("Category newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to category newsletter" },
      { status: 500 }
    );
  }
}

