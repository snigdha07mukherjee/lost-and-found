import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const body = await req.json();

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const item = await prisma.item.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      location: body.location,
      type: body.type,
      postedById: dbUser.id,
    },
  });

  return NextResponse.json(item, { status: 201 });
}