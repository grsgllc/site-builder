"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TemplateSelectionPage from "@/components/TemplateSelectionPage";

export default function NewSitePage() {
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
          className="text-left font-mono font-bold text-lg hover:underline flex items-center gap-2"
        >
          ← Change Template
        </button>
      </div>

      {templateSelected && (
        <div className="mb-6 border-4 border-black bg-yellow-300 p-4">
          <p className="font-mono font-bold">
            Template Selected: {selectedLayoutName}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold font-mono mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input input-bordered w-full border-2 border-black font-mono"
              placeholder="My Awesome Site"
            />
          </div>

          <div>
            <label className="block text-lg font-bold font-mono mb-2">
              Subdomain
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                required
                minLength={3}
                className="input input-bordered flex-1 border-2 border-black font-mono"
                placeholder="mysite"
              />
              <span className="font-mono font-bold">.yourapp.com</span>
            </div>
            {checkingSubdomain && (
              <p className="text-sm font-mono mt-2 text-gray-600">
                Checking availability...
              </p>
            )}
            {subdomainAvailable === true && !checkingSubdomain && (
              <p className="text-sm font-mono mt-2 text-green-600 font-bold">
                ✓ Available!
              </p>
            )}
            {subdomainAvailable === false && !checkingSubdomain && (
              <p className="text-sm font-mono mt-2 text-red-600 font-bold">
                ✗ Not available or invalid format
              </p>
            )}
            <p className="text-xs font-mono mt-2 text-gray-500">
              Only lowercase letters, numbers, and hyphens. Min 3 characters.
            </p>
          </div>

          <div>
            <label className="block text-lg font-bold font-mono mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full border-2 border-black font-mono"
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
