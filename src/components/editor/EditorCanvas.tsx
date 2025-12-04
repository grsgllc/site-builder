"use client";

import { useState, useRef, useEffect } from "react";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { ComponentRenderer } from "./ComponentRenderer";

interface EditorCanvasProps {
  components: any[];
  selectedComponent: string | null;
  viewportMode: 'mobile' | 'desktop';
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
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = -e.deltaY * 0.001;
      let newZoom = zoom + zoomDelta;
      newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));
      onZoomChange(newZoom);
    }
  };

  const handleDragEndInternal = (event: DragEndEvent) => {
    const { active, delta } = event;
    onDragEnd(active.id as string, delta);
  };

  return (
    <div
      ref={viewportRef}
      className="relative overflow-auto"
      style={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        backgroundColor: '#000',
      }}
      onWheel={handleWheel}
    >
      <div
        style={{
          minWidth: `calc(${canvasDimensions.width}px * ${zoom} + ${viewportPadding * 2}px)`,
          minHeight: `calc(${canvasDimensions.height}px * ${zoom} + ${viewportPadding * 2}px)`,
          padding: `${viewportPadding}px`,
          backgroundColor: '#000',
        }}
      >
        <DndContext
          onDragEnd={handleDragEndInternal}
          onDragStart={onDragStart}
        >
          <div
            ref={canvasRef}
            className="relative"
            style={{
              width: `${canvasDimensions.width}px`,
              height: `${canvasDimensions.height}px`,
              backgroundColor: '#000',
              border: '4px solid #fff',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
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

            {/* Empty State */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 border-4 border-dashed border-white bg-gray-800">
                  <p className="font-bold text-xl mb-2 text-white">No components yet</p>
                  <p className="text-sm text-gray-400">
                    Add components from the sidebar to get started
                  </p>
                </div>
              </div>
            )}
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
