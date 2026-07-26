"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClaimButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [proof, setProof] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClaim() {
    setLoading(true);
    await fetch("/api/claims", {
      method: "POST",
      body: JSON.stringify({ itemId, proof }),
    });
    setLoading(false);
    router.refresh();
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Claim this item
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        placeholder="Describe why this is yours (proof of ownership)"
        value={proof}
        onChange={(e) => setProof(e.target.value)}
        className="rounded border p-2"
      />
      <button
        onClick={handleClaim}
        disabled={loading || !proof}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Claim"}
      </button>
    </div>
  );
}