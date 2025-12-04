"use client";

import { useEditor } from "@/context/EditorContext";
import { useState } from "react";
import { Template } from "@/types";
import { FaChevronLeft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TemplateSelectionPage({
  templates,
}: {
  templates: Template[];
}) {
  const router = useRouter();
  const [availableTemplates, setAvailableTemplates] =
    useState<Template[]>(templates);

  const onSelect = (templateId: string | null) => {
    const href = `/editor/new${templateId ? `?templateId=${templateId}` : ""}`;
    router.push(href);
  };

  /* const filteredLayouts =
    filter === "all"
      ? availableLayouts
      : availableLayouts.filter((l) => (l.category || "Other") === filter); */

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-row border-b-1 border-white w-full">
        <div className="shrink border-r-1 border-white p-2">
          <FaChevronLeft
            onClick={() => router.back()}
            size={28}
            className="font-bold"
            strokeWidth={3}
          />
        </div>
        <div className="flex grow items-center ml-4">
          <h1 className="text-3xl font-black">Templates</h1>
        </div>
      </div>

      {/* Templates */}
      <div className="mt-4 flex flex-col md:flex-row gap-6 md:p-6">
        {/* Blank Page */}
        <TemplateCard onSelect={onSelect} />

        {availableTemplates.map((template) => (
          <TemplateCard template={template} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onSelect,
}: {
  template?: Template | null;
  onSelect: (templateId: string | null) => void;
}) {
  return (
    <div
      className="card rounded-none border-1 border-white overflow-hidden md:max-w-xs cursor-pointer"
      onClick={() => onSelect(template?.id ?? null)}
    >
      <figure>
        <Image
          width={1000}
          height={1000}
          src={template?.previewImg ?? "/blank-layout-image.jpg"}
          alt={template?.name ?? "Blank Page"}
          priority={template ? false : true}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title ">{template?.name ?? "Blank Page"}</h2>
        {template?.description && (
          <p className="text-sm  mt-3 line-clamp-2 text-gray-700">
            {template.description}
          </p>
        )}
      </div>
    </div>
  );
}
