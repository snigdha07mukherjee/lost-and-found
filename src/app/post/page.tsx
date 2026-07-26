"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("lost");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify({ title, description, category, location, type }),
    });
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-lg p-4 sm:p-8">
      <h1 className="mb-6 text-2xl font-semibold">Post an Item</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded border p-2"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border p-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded border p-2"
          required
        />
        <input
          placeholder="Category (e.g. Electronics, ID Card)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border p-2"
          required
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded border p-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Item"}
        </button>
      </form>
    </main>
  );
}