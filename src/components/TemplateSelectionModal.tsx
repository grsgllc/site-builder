"use client";

import { useState, useEffect } from "react";

interface Layout {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  isDefault: boolean;
}

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onSelect: (layoutId: string | null, layoutName: string) => void;
  onClose: () => void;
}

export default function TemplateSelectionModal({
  isOpen,
  onSelect,
  onClose,
}: TemplateSelectionModalProps) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchLayouts();
    }
  }, [isOpen]);

  const fetchLayouts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/layouts");
      if (res.ok) {
        const data = await res.json();
        setLayouts(data.layouts);
      }
    } catch (error) {
      console.error("Error fetching layouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedId === null) {
      onSelect(null, "Blank Site");
    } else {
      const selectedLayout = layouts.find((l) => l.id === selectedId);
      onSelect(selectedId, selectedLayout?.name || "Custom Layout");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-black border-8 border-white max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b-8 border-black bg-yellow-300 p-6">
          <h2 className="text-4xl font-black  uppercase">Choose a Template</h2>
          <p className="text-lg  mt-2">
            Select a layout to start building your site
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-2xl  font-bold">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Blank Site Option - Always First */}
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className={`border-4 border-black p-6 text-left hover:bg-gray-100 transition-colors ${
                  selectedId === null
                    ? "bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <div className="h-32 border-4 border-black bg-white flex items-center justify-center mb-4">
                  <span className="text-6xl">⬜</span>
                </div>
                <h3 className="text-xl font-black  mb-2 uppercase">
                  Blank Site
                </h3>
                <p className=" text-sm">
                  Start from scratch with a completely empty canvas
                </p>
                {selectedId === null && (
                  <div className="mt-3  font-bold text-sm">✓ SELECTED</div>
                )}
              </button>

              {/* Layout Templates */}
              {layouts.map((layout) => (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => setSelectedId(layout.id)}
                  className={`border-4 border-black p-6 text-left hover:bg-gray-100 transition-colors ${
                    selectedId === layout.id
                      ? "bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="h-32 border-4 border-black bg-gradient-to-br from-white via-gray-100 to-gray-200 flex items-center justify-center mb-4">
                    {layout.thumbnail ? (
                      <img
                        src={layout.thumbnail}
                        alt={layout.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📐</span>
                    )}
                  </div>
                  <h3 className="text-xl font-black  mb-2 uppercase">
                    {layout.name}
                  </h3>
                  <p className=" text-sm">
                    {layout.description || "Pre-designed layout template"}
                  </p>
                  {layout.isDefault && (
                    <div className="mt-2 inline-block bg-black text-white px-2 py-1 text-xs  font-bold">
                      DEFAULT
                    </div>
                  )}
                  {selectedId === layout.id && (
                    <div className="mt-3  font-bold text-sm">✓ SELECTED</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-8 border-black bg-gray-100 p-6 flex gap-4">
          <button
            type="button"
            onClick={handleSelect}
            disabled={loading}
            className="btn btn-primary flex-1 border-4 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 uppercase"
          >
            Continue →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline flex-1 border-4 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
