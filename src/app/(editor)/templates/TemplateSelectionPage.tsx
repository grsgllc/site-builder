"use client";

import { useEditor } from "@/context/EditorContext";
import { useState } from "react";
import { Layout } from "@prisma/client";
import { FaChevronLeft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TemplateSelectionPage({
  layouts,
}: {
  layouts: Layout[];
}) {
  const router = useRouter();
  const [availableLayouts, setAvailableLayouts] = useState<Layout[]>(layouts);

  const onSelect = (layoutId: string | null) => {
    const href = `/editor/new${layoutId ? `?templateId=${layoutId}` : ""}`;
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

        {availableLayouts.map((layout) => (
          <TemplateCard layout={layout} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  layout,
  onSelect,
}: {
  layout?: Layout | null;
  onSelect: (layoutId: string | null) => void;
}) {
  return (
    <div
      className="card rounded-none border-1 border-white overflow-hidden md:max-w-xs"
      onClick={() => onSelect(layout?.id ?? null)}
    >
      <figure>
        <Image
          width={1000}
          height={1000}
          src={layout?.thumbnail ?? "/blank-layout-image.jpg"}
          alt={layout?.name ?? "Blank Page"}
          priority={layout ? false : true}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title ">{layout?.name ?? "Blank Page"}</h2>
        {layout?.description && (
          <p className="text-sm  mt-3 line-clamp-2 text-gray-700">
            {layout.description}
          </p>
        )}
      </div>
    </div>
  );
}
