"use client";

import { useState, useRef, useEffect } from "react";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { ComponentRenderer } from "./ComponentRenderer";

interface EditorCanvasProps {
  components: any[];
  selectedComponent: string | null;
  viewportMode: "mobile" | "desktop";
  zoom: number;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: any) => void;
  onDragStart: () => void;
  onDragEnd: (componentId: string, delta: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
}

export function EditorCanvas({
  components,
  selectedComponent,
  viewportMode,
  zoom,
  onSelectComponent,
  onUpdateComponent,
  onDragStart,
  onDragEnd,
  onZoomChange,
}: EditorCanvasProps) {
  const CANVAS_DIMENSIONS = {
    mobile: { width: 375, height: 667 },
    desktop: { width: 1200, height: 675 },
  };
  const ZOOM_MIN = 0.25;
  const ZOOM_MAX = 2.0;
  const GRID_SIZE = 20;

  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewportPadding, setViewportPadding] = useState(0);

  const canvasDimensions = CANVAS_DIMENSIONS[viewportMode];

  useEffect(() => {
    const updatePadding = () => {
      if (viewportRef.current) {
        const viewportWidth = viewportRef.current.clientWidth;
        const viewportHeight = viewportRef.current.clientHeight;
        const padding = Math.min(viewportWidth, viewportHeight) * 0.5;
        setViewportPadding(padding);
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheelNative = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = -e.deltaY * 0.001;
        let newZoom = zoom + zoomDelta;
        newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));
        onZoomChange(newZoom);
      }
    };

    viewport.addEventListener("wheel", handleWheelNative, {
      passive: false,
      capture: true,
    });

    return () => {
      viewport.removeEventListener("wheel", handleWheelNative, {
        capture: true,
      } as EventListenerOptions);
    };
  }, [zoom, onZoomChange]);

  const handleDragEndInternal = (event: DragEndEvent) => {
    const { active, delta } = event;
    onDragEnd(active.id as string, delta);
  };

  return (
    <div
      ref={viewportRef}
      className="relative overflow-auto flex-1"
      style={{
        width: "100%",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          minWidth: `calc(${canvasDimensions.width}px * ${zoom} + ${
            viewportPadding * 2
          }px)`,
          minHeight: `calc(${canvasDimensions.height}px * ${zoom} + ${
            viewportPadding * 2
          }px)`,
          padding: `${viewportPadding}px`,
          backgroundColor: "#000",
        }}
      >
        <DndContext onDragEnd={handleDragEndInternal} onDragStart={onDragStart}>
          <div
            ref={canvasRef}
            className="relative bg-black border-1 border-white rounded-md"
            style={{
              width: `${canvasDimensions.width}px`,
              height: `${canvasDimensions.height}px`,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
            onClick={(e) => {
              if (e.target === canvasRef.current) {
                onSelectComponent(null);
              }
            }}
          >
            {/* Components */}
            {components.map((component) => (
              <DraggableComponent
                key={component.id}
                component={component}
                isSelected={selectedComponent === component.id}
                onSelect={() => onSelectComponent(component.id)}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

function DraggableComponent({
  component,
  isSelected,
  onSelect,
}: {
  component: any;
  isSelected: boolean;
  onSelect: () => void;
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
