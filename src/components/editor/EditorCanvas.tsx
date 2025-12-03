"use client";

import { useState, useRef } from "react";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { ComponentRenderer } from "./ComponentRenderer";

export function EditorCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    /* const { active, delta } = event;
    const component = components.find((c) => c.id === active.id);

    if (component) {
      onUpdateComponent(component.id, {
        positionX: component.positionX + delta.x,
        positionY: component.positionY + delta.y,
      });
    }

    setIsDragging(false); */
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsDragging(true)}
    >
      <div
        ref={canvasRef}
        className="relative min-h-screen bg-white mx-auto"
        style={{
          width: "1200px",
          boxShadow: "0 0 40px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => {
          if (e.target === canvasRef.current) {
            onSelectComponent(null);
          }
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Layout Sections (if layout is defined) */}
        {layout?.structure?.sections?.map((section: any, index: number) => (
          <div
            key={index}
            className="border-2 border-dashed border-gray-400 relative"
            style={{
              minHeight: section.minHeight || 200,
              backgroundColor: section.backgroundColor || "transparent",
            }}
          >
            <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs  font-bold">
              {section.name}
            </div>
          </div>
        ))}

        {/* Components */}
        {components.map((component) => (
          <DraggableComponent
            key={component.id}
            component={component}
            isSelected={selectedComponent === component.id}
            onSelect={() => onSelectComponent(component.id)}
            onUpdate={(updates) => onUpdateComponent(component.id, updates)}
          />
        ))}

        {/* Empty State */}
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 border-4 border-dashed border-gray-400 bg-yellow-100">
              <p className=" font-bold text-xl mb-2">No components yet</p>
              <p className=" text-sm text-gray-600">
                Add components from the sidebar to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}

function DraggableComponent({
  component,
  isSelected,
  onSelect,
  onUpdate,
}: {
  component: any;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: component.id,
    });

  const style = {
    position: "absolute" as const,
    left: component.positionX,
    top: component.positionY,
    width: component.width || "auto",
    height: component.height || "auto",
    zIndex: component.zIndex,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`cursor-move ${
        isSelected
          ? "ring-4 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <ComponentRenderer component={component} isEditor={true} />

      {isSelected && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 text-xs  font-bold flex items-center gap-2">
          <span>{component.type}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle resize
            }}
            className="hover:text-yellow-300"
          >
            ⇲
          </button>
        </div>
      )}
    </div>
  );
}
