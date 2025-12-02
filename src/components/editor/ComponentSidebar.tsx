"use client";

import { useState } from "react";

interface ComponentSidebarProps {
  onAddComponent: (type: string) => void;
}

const componentCategories = [
  {
    name: "Basic",
    components: [
      { type: "text", label: "Text", icon: "T", description: "Plain text" },
      {
        type: "heading",
        label: "Heading",
        icon: "H1",
        description: "Bold headings",
      },
      {
        type: "image",
        label: "Image",
        icon: "🖼",
        description: "Add images",
      },
      {
        type: "button",
        label: "Button",
        icon: "BTN",
        description: "Click buttons",
      },
      {
        type: "video",
        label: "Video",
        icon: "▶",
        description: "Video player",
      },
    ],
  },
  {
    name: "Media",
    components: [
      {
        type: "gallery",
        label: "Gallery",
        icon: "🖼🖼",
        description: "Image gallery",
      },
      {
        type: "carousel",
        label: "Carousel",
        icon: "⇄",
        description: "Image slider",
      },
      {
        type: "embed",
        label: "Embed",
        icon: "YT",
        description: "YouTube, etc.",
      },
    ],
  },
  {
    name: "Effects",
    components: [
      {
        type: "animated-text",
        label: "Animated Text",
        icon: "✨",
        description: "Text effects",
      },
      {
        type: "parallax",
        label: "Parallax",
        icon: "∥",
        description: "Scroll effects",
      },
      {
        type: "particles",
        label: "Particles",
        icon: "···",
        description: "Particle BG",
      },
    ],
  },
];

export function ComponentSidebar({ onAddComponent }: ComponentSidebarProps) {
  const [activeCategory, setActiveCategory] = useState("Basic");

  return (
    <div className="w-72 bg-black border-r-4 border-black flex flex-col">
      <div className="p-4 border-b-2 border-gray-700">
        <h2 className="text-white  font-bold text-lg">Components</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b-2 border-gray-700">
        {componentCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`flex-1 py-2 px-3  font-bold text-sm border-r-2 border-gray-700 transition-colors ${
              activeCategory === category.name
                ? "bg-yellow-400 text-black"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {componentCategories
          .find((cat) => cat.name === activeCategory)
          ?.components.map((component) => (
            <button
              key={component.type}
              onClick={() => onAddComponent(component.type)}
              className="w-full p-4 bg-white border-4 border-black text-left hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center  font-bold text-sm border-2 border-black">
                  {component.icon}
                </div>
                <div className="flex-1">
                  <div className=" font-bold text-black">{component.label}</div>
                  <div className=" text-xs text-gray-600">
                    {component.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
