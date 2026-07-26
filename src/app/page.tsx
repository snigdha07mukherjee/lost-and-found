import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { postedBy: { select: { name: true } } },
  });

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Lost & Found</h1>
          {session?.user && (
            <Link href="/post" className="text-sm text-green-600 underline">
            + Post an item
            </Link>
       )}
         </div>
        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Hi, {session.user.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="text-sm text-red-600 underline">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="text-sm text-blue-600 underline">
            Sign in
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No items posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.location}</p>
              <span className="text-xs uppercase text-blue-600">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}