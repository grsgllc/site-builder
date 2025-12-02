"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa";
import { Layout } from "@prisma/client";

export default function NewSitePage({ layouts }: { layouts: Layout[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null
  );
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(true);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [selectedLayoutName, setSelectedLayoutName] = useState<string>("");
  const [templateSelected, setTemplateSelected] = useState(false);

  const checkSubdomain = async (value: string) => {
    if (!value || value.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    // Validate subdomain format
    const isValid = /^[a-z0-9-]+$/.test(value);
    if (!isValid) {
      setSubdomainAvailable(false);
      return;
    }

    setCheckingSubdomain(true);
    try {
      const res = await fetch(`/api/sites/check-subdomain?subdomain=${value}`);
      const data = await res.json();
      setSubdomainAvailable(data.available);
    } catch (error) {
      console.error("Error checking subdomain:", error);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  const handleSubdomainChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(cleaned);
    checkSubdomain(cleaned);
  };

  const handleTemplateSelect = (
    layoutId: string | null,
    layoutName: string
  ) => {
    setSelectedLayoutId(layoutId);
    setSelectedLayoutName(layoutName);
    setTemplateSelected(true);
    setShowTemplateModal(false);
  };

  const handleBackToTemplates = () => {
    setShowTemplateModal(true);
    setTemplateSelected(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subdomainAvailable) {
      toast.error("Please choose an available subdomain");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          name,
          description,
          layoutId: selectedLayoutId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create site");
      }

      const data = await res.json();
      toast.success("Site created successfully!");
      router.push(`/editor/${data.site.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create site");
    } finally {
      setLoading(false);
    }
  };

  if (showTemplateModal) {
    return (
      <TemplateSelectionPage
        layouts={layouts}
        selectedLayoutId={selectedLayoutId}
        selectedLayoutName={selectedLayoutName}
        onSelect={handleTemplateSelect}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBackToTemplates}
          className="text-left  font-bold text-lg hover:underline flex items-center gap-2"
        >
          ← Change Template
        </button>
      </div>

      {templateSelected && (
        <div className="mb-6 border-4 border-black bg-yellow-300 p-4">
          <p className=" font-bold">Template Selected: {selectedLayoutName}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold  mb-2">Site Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input input-bordered w-full border-2 border-black "
              placeholder="My Awesome Site"
            />
          </div>

          <div>
            <label className="block text-lg font-bold  mb-2">Subdomain</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                required
                minLength={3}
                className="input input-bordered flex-1 border-2 border-black "
                placeholder="mysite"
              />
              <span className=" font-bold">.yourapp.com</span>
            </div>
            {checkingSubdomain && (
              <p className="text-sm  mt-2 text-gray-600">
                Checking availability...
              </p>
            )}
            {subdomainAvailable === true && !checkingSubdomain && (
              <p className="text-sm  mt-2 text-green-600 font-bold">
                ✓ Available!
              </p>
            )}
            {subdomainAvailable === false && !checkingSubdomain && (
              <p className="text-sm  mt-2 text-red-600 font-bold">
                ✗ Not available or invalid format
              </p>
            )}
            <p className="text-xs  mt-2 text-gray-500">
              Only lowercase letters, numbers, and hyphens. Min 3 characters.
            </p>
          </div>

          <div>
            <label className="block text-lg font-bold  mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full border-2 border-black "
              placeholder="A brief description of your site"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !subdomainAvailable}
              className="btn btn-primary flex-1 border-4 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Site"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline flex-1 border-4 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function TemplateSelectionPage({
  layouts,
  selectedLayoutId,
  selectedLayoutName,
  onSelect,
  onBack,
}: {
  layouts: Layout[];
  selectedLayoutId: string | null;
  selectedLayoutName: string;
  onSelect: (layoutId: string | null, layoutName: string) => void;
  onBack: () => void;
}) {
  const [availableLayouts, setAvailableLayouts] = useState<Layout[]>(layouts);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  /* const filteredLayouts =
    filter === "all"
      ? availableLayouts
      : availableLayouts.filter((l) => (l.category || "Other") === filter); */

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b-4 border-black p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <FaChevronLeft size={28} className="font-bold" strokeWidth={3} />
          </button>
          <h1 className="text-3xl font-black  uppercase">Templates</h1>
        </div>

        {/* Filter Dropdown */}
        {/* <div className="max-w-xs">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered w-full border-2 border-black  font-bold text-base bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Template List */}
      <div
        className="p-6 overflow-y-auto"
        style={{ height: "calc(100vh - 180px)" }}
      >
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
                <h3 className="text-2xl font-black  uppercase mb-2">
                  Blank Site
                </h3>
                <p className=" text-base text-gray-700 mb-3">
                  Start from scratch with a completely empty canvas
                </p>
                {selectedLayoutId === null && (
                  <div className="inline-block bg-black text-white px-3 py-1  font-bold text-sm">
                    ✓ SELECTED
                  </div>
                )}
              </div>
            </div>
          </button>

          {/* Layout Templates */}
          {availableLayouts.length > 0 ? (
            availableLayouts.map((layout) => (
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
                        <h3 className="text-2xl font-black  uppercase mb-2">
                          {layout.name}
                        </h3>
                        <p className=" text-base text-gray-700 mb-3">
                          {layout.description || "Pre-designed layout template"}
                        </p>
                      </div>
                      {layout.isDefault && (
                        <div className="bg-black text-white px-3 py-1 text-xs  font-bold flex-shrink-0 mt-1">
                          DEFAULT
                        </div>
                      )}
                    </div>
                    {selectedLayoutId === layout.id && (
                      <div className="inline-block bg-black text-white px-3 py-1  font-bold text-sm">
                        ✓ SELECTED
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl  text-gray-500">
                No templates found in this category
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
