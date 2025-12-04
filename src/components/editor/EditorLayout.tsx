"use client";

import { useState, useEffect } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { ComponentSidebar } from "./ComponentSidebar";
import { EditorCanvas } from "./EditorCanvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { FaChevronLeft } from "react-icons/fa";
import { TbBackground } from "react-icons/tb";
import { FiPlus } from "react-icons/fi";

interface EditorLayoutProps {
  site?: any;
  user?: any;
}

export function EditorLayout({ site, user }: EditorLayoutProps = { site: null, user: null }) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [components, setComponents] = useState<any[]>([]);
  //const [page, setPage] = useState(site.pages[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportMode, setViewportMode] = useState<'mobile' | 'desktop'>('mobile');
  const [zoom, setZoom] = useState(1);

  /* useEffect(() => {
    if (page) {
      setComponents(page.components || []);
    }
  }, [page]); */

  const handleAddComponent = (type: string) => {
    const newComponent = {
      id: `temp-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      positionX: 100,
      positionY: 100,
      width: 300,
      height: 200,
      zIndex: components.length,
      layoutSection: null,
    };

    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const handleUpdateComponent = (id: string, updates: any) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const handleDragEnd = (componentId: string, delta: { x: number; y: number }) => {
    const component = components.find((c) => c.id === componentId);
    if (component) {
      handleUpdateComponent(componentId, {
        positionX: component.positionX + delta.x / zoom,
        positionY: component.positionY + delta.y / zoom,
      });
    }
    setIsDragging(false);
  };

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log("Saving...", components);
  };

  return (
    <div className="flex flex-col">
      <EditorToolbar />
      <EditorCanvas
        components={components}
        selectedComponent={selectedComponent}
        viewportMode={viewportMode}
        zoom={zoom}
        onSelectComponent={setSelectedComponent}
        onUpdateComponent={handleUpdateComponent}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onZoomChange={setZoom}
      />
    </div>
  );
}

function getDefaultProps(type: string): any {
  const defaults: Record<string, any> = {
    text: {
      content: "New Text",
      fontSize: 16,
      fontWeight: "normal",
      color: "#000000",
      fontFamily: "monospace",
    },
    heading: {
      content: "New Heading",
      level: 1,
      fontSize: 48,
      fontWeight: "bold",
      color: "#000000",
      fontFamily: "monospace",
    },
    image: {
      src: "",
      alt: "Image",
      objectFit: "cover",
    },
    button: {
      text: "Click Me",
      backgroundColor: "#FFFF00",
      color: "#000000",
      borderColor: "#000000",
      borderWidth: 4,
      fontSize: 16,
      fontWeight: "bold",
      href: "#",
    },
    video: {
      src: "",
      autoplay: false,
      controls: true,
      loop: false,
    },
  };

  return defaults[type] || {};
}
