"use client";

import { useState, useEffect } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { ComponentSidebar } from "./ComponentSidebar";
import { EditorCanvas } from "./EditorCanvas";
import { PropertiesPanel } from "./PropertiesPanel";

interface EditorLayoutProps {
  site: any;
  user: any;
}

export function EditorLayout({ site, user }: EditorLayoutProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [components, setComponents] = useState<any[]>([]);
  const [page, setPage] = useState(site.pages[0]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (page) {
      setComponents(page.components || []);
    }
  }, [page]);

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

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log("Saving...", components);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <EditorToolbar
        siteName={site.name}
        onSave={handleSave}
        published={site.published}
        subdomain={site.subdomain}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Component Library Sidebar */}
        <ComponentSidebar onAddComponent={handleAddComponent} />

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-200">
          <EditorCanvas
            layout={site.layout}
            components={components}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
        </div>

        {/* Properties Panel */}
        {selectedComponent && (
          <PropertiesPanel
            component={components.find((c) => c.id === selectedComponent)}
            onUpdate={(updates) =>
              handleUpdateComponent(selectedComponent, updates)
            }
            onDelete={() => handleDeleteComponent(selectedComponent)}
            onClose={() => setSelectedComponent(null)}
          />
        )}
      </div>
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
