"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

interface Layout {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  isDefault: boolean;
  category?: string;
}

interface TemplateSelectionPageProps {
  selectedLayoutId: string | null;
  selectedLayoutName: string;
  onSelect: (layoutId: string | null, layoutName: string) => void;
  onBack: () => void;
}

export default function TemplateSelectionPage({
  selectedLayoutId,
  selectedLayoutName,
  onSelect,
  onBack,
}: TemplateSelectionPageProps) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/layouts");
      if (res.ok) {
        const data = await res.json();
        setLayouts(data.layouts);

        // Extract unique categories
        const cats = Array.from(
          new Set(data.layouts.map((l: Layout) => l.category || "Other"))
        ) as string[];
        setCategories(["all", ...cats.sort()]);
      }
    } catch (error) {
      console.error("Error fetching layouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLayouts =
    filter === "all"
      ? layouts
      : layouts.filter((l) => (l.category || "Other") === filter);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b-4 border-black bg-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={28} className="font-bold" strokeWidth={3} />
          </button>
          <h1 className="text-3xl font-black font-mono uppercase">Templates</h1>
        </div>

        {/* Filter Dropdown */}
        <div className="max-w-xs">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered w-full border-2 border-black font-mono font-bold text-base bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Template List */}
      <div className="p-6 overflow-y-auto" style={{ height: "calc(100vh - 180px)" }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-2xl font-mono font-bold">Loading templates...</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {/* Blank Site Option */}
            <button
              onClick={() => onSelect(null, "Blank Site")}
              className={`w-full border-4 border-black p-6 text-left transition-all ${
                selectedLayoutId === null
                  ? "bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <div className="flex items-start gap-6">
                <div className="h-32 w-32 flex-shrink-0 border-4 border-black bg-gray-100 flex items-center justify-center">
                  <span className="text-5xl">⬜</span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-black font-mono uppercase mb-2">
                    Blank Site
                  </h3>
                  <p className="font-mono text-base text-gray-700 mb-3">
                    Start from scratch with a completely empty canvas
                  </p>
                  {selectedLayoutId === null && (
                    <div className="inline-block bg-black text-white px-3 py-1 font-mono font-bold text-sm">
                      ✓ SELECTED
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* Layout Templates */}
            {filteredLayouts.length > 0 ? (
              filteredLayouts.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => onSelect(layout.id, layout.name)}
                  className={`w-full border-4 border-black p-6 text-left transition-all ${
                    selectedLayoutId === layout.id
                      ? "bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className="h-32 w-32 flex-shrink-0 border-4 border-black bg-gradient-to-br from-white via-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                      {layout.thumbnail ? (
                        <img
                          src={layout.thumbnail}
                          alt={layout.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl">📐</span>
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-black font-mono uppercase mb-2">
                            {layout.name}
                          </h3>
                          <p className="font-mono text-base text-gray-700 mb-3">
                            {layout.description || "Pre-designed layout template"}
                          </p>
                        </div>
                        {layout.isDefault && (
                          <div className="bg-black text-white px-3 py-1 text-xs font-mono font-bold flex-shrink-0 mt-1">
                            DEFAULT
                          </div>
                        )}
                      </div>
                      {selectedLayoutId === layout.id && (
                        <div className="inline-block bg-black text-white px-3 py-1 font-mono font-bold text-sm">
                          ✓ SELECTED
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-xl font-mono text-gray-500">
                  No templates found in this category
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
