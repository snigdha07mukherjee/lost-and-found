import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendClaimEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { itemId, proof } = body;

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const claim = await prisma.claim.create({
    data: {
      itemId,
      claimantId: dbUser.id,
      proof,
    },
  });

  const item = await prisma.item.update({
    where: { id: itemId },
    data: { status: "CLAIMED" },
    include: { postedBy: true },
  });

  if (item.postedBy.email) {
    sendClaimEmail(item.postedBy.email, item.title);
  }

  return NextResponse.json(claim, { status: 201 });
}