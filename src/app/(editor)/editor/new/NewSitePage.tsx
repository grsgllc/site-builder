"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEditor } from "@/context/EditorContext";
import { useState } from "react";
import Image from "next/image";
import { EditorLayout } from "@/components/editor/EditorLayout";

export default function NewSitePage() {
  const router = useRouter();
  const {
    state,
    setName,
    setSubdomain,
    setDescription,
    setSelectedLayout,
    setShowTemplateModal,
    setTemplateSelected,
    setSubdomainAvailable,
    setCheckingSubdomain,
    setLoading,
  } = useEditor();

  /* const checkSubdomain = async (value: string) => {
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
  }; */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.subdomainAvailable) {
      toast.error("Please choose an available subdomain");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: state.subdomain,
          name: state.name,
          description: state.description,
          layoutId: state.selectedLayoutId,
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

  return <EditorLayout />;
}
