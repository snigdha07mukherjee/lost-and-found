import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ClaimButton from "./ClaimButton";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const item = await prisma.item.findUnique({
    where: { id },
    include: { postedBy: { select: { name: true } } },
  });

  if (!item) notFound();

  return (
    <main className="mx-auto max-w-lg p-4 sm:p-8">
      <h1 className="mb-2 text-2xl font-semibold">{item.title}</h1>
      <p className="mb-1 text-gray-600">{item.description}</p>
      <p className="mb-1 text-sm text-gray-500">Location: {item.location}</p>
      <p className="mb-1 text-sm text-gray-500">Category: {item.category}</p>
      <p className="mb-1 text-sm text-gray-500">
        Posted by: {item.postedBy.name}
      </p>
      <span className="mb-4 inline-block text-xs uppercase text-blue-600">
        {item.status}
      </span>

      {session?.user && item.status === "OPEN" && (
        <ClaimButton itemId={item.id} />
      )}
    </main>
  );
}