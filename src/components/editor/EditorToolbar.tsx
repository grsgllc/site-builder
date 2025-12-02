"use client";

import Link from "next/link";
import { useState } from "react";

interface EditorToolbarProps {
  siteName: string;
  onSave: () => void;
  published: boolean;
  subdomain: string;
}

export function EditorToolbar({
  siteName,
  onSave,
  published,
  subdomain,
}: EditorToolbarProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  return (
    <div className="h-16 bg-black border-b-4 border-black flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-white  font-bold hover:text-yellow-300 transition-colors"
        >
          ← Dashboard
        </Link>
        <div className="h-8 w-px bg-gray-600" />
        <h1 className="text-white  font-bold text-lg">{siteName}</h1>
        <span
          className={`px-2 py-1 text-xs font-bold  border-2 ${
            published
              ? "bg-green-400 border-green-600"
              : "bg-gray-400 border-gray-600"
          }`}
        >
          {published ? "LIVE" : "DRAFT"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {published && (
          <a
            href={`https://${subdomain}.yourapp.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-black  font-bold border-2 border-white hover:bg-gray-200 transition-colors"
          >
            View Live
          </a>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-yellow-400 text-black  font-bold border-2 border-yellow-600 hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button className="px-4 py-2 bg-blue-500 text-white  font-bold border-2 border-blue-700 hover:bg-blue-400 transition-colors">
          Preview
        </button>

        <button className="px-4 py-2 bg-red-500 text-white  font-bold border-2 border-red-700 hover:bg-red-400 transition-colors">
          Publish
        </button>
      </div>
    </div>
  );
}
