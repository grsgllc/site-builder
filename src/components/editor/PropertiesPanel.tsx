"use client";

interface PropertiesPanelProps {
  component: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function PropertiesPanel({
  component,
  onUpdate,
  onDelete,
  onClose,
}: PropertiesPanelProps) {
  if (!component) return null;

  const { type, props } = component;

  const updateProp = (key: string, value: any) => {
    onUpdate({
      props: {
        ...props,
        [key]: value,
      },
    });
  };

  return (
    <div className="w-80 bg-white border-l-4 border-black flex flex-col overflow-auto">
      {/* Header */}
      <div className="p-4 border-b-2 border-black bg-black flex items-center justify-between">
        <h2 className="text-white font-mono font-bold text-lg capitalize">
          {type} Properties
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:text-red-400 font-bold"
        >
          ✕
        </button>
      </div>

      {/* Properties */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Position & Size */}
        <PropertySection title="Position & Size">
          <PropertyInput
            label="X Position"
            type="number"
            value={component.positionX}
            onChange={(value) =>
              onUpdate({ positionX: parseFloat(value) })
            }
          />
          <PropertyInput
            label="Y Position"
            type="number"
            value={component.positionY}
            onChange={(value) =>
              onUpdate({ positionY: parseFloat(value) })
            }
          />
          <PropertyInput
            label="Width"
            type="number"
            value={component.width || 0}
            onChange={(value) => onUpdate({ width: parseFloat(value) })}
          />
          <PropertyInput
            label="Height"
            type="number"
            value={component.height || 0}
            onChange={(value) => onUpdate({ height: parseFloat(value) })}
          />
          <PropertyInput
            label="Z-Index"
            type="number"
            value={component.zIndex}
            onChange={(value) => onUpdate({ zIndex: parseInt(value) })}
          />
        </PropertySection>

        {/* Type-specific properties */}
        {(type === "text" || type === "heading") && (
          <>
            <PropertySection title="Content">
              <PropertyInput
                label="Text"
                type="textarea"
                value={props.content}
                onChange={(value) => updateProp("content", value)}
              />
              {type === "heading" && (
                <PropertyInput
                  label="Level (H1-H6)"
                  type="number"
                  min={1}
                  max={6}
                  value={props.level}
                  onChange={(value) =>
                    updateProp("level", parseInt(value))
                  }
                />
              )}
            </PropertySection>

            <PropertySection title="Typography">
              <PropertyInput
                label="Font Size"
                type="number"
                value={props.fontSize}
                onChange={(value) =>
                  updateProp("fontSize", parseInt(value))
                }
              />
              <PropertyInput
                label="Font Weight"
                type="select"
                value={props.fontWeight}
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "bold", label: "Bold" },
                  { value: "900", label: "Black" },
                ]}
                onChange={(value) => updateProp("fontWeight", value)}
              />
              <PropertyInput
                label="Color"
                type="color"
                value={props.color}
                onChange={(value) => updateProp("color", value)}
              />
              <PropertyInput
                label="Font Family"
                type="select"
                value={props.fontFamily}
                options={[
                  { value: "monospace", label: "Monospace" },
                  { value: "serif", label: "Serif" },
                  { value: "sans-serif", label: "Sans-serif" },
                ]}
                onChange={(value) => updateProp("fontFamily", value)}
              />
            </PropertySection>
          </>
        )}

        {type === "button" && (
          <>
            <PropertySection title="Button">
              <PropertyInput
                label="Text"
                type="text"
                value={props.text}
                onChange={(value) => updateProp("text", value)}
              />
              <PropertyInput
                label="Link URL"
                type="text"
                value={props.href}
                onChange={(value) => updateProp("href", value)}
              />
            </PropertySection>

            <PropertySection title="Styling">
              <PropertyInput
                label="Background Color"
                type="color"
                value={props.backgroundColor}
                onChange={(value) => updateProp("backgroundColor", value)}
              />
              <PropertyInput
                label="Text Color"
                type="color"
                value={props.color}
                onChange={(value) => updateProp("color", value)}
              />
              <PropertyInput
                label="Border Color"
                type="color"
                value={props.borderColor}
                onChange={(value) => updateProp("borderColor", value)}
              />
              <PropertyInput
                label="Border Width"
                type="number"
                value={props.borderWidth}
                onChange={(value) =>
                  updateProp("borderWidth", parseInt(value))
                }
              />
            </PropertySection>
          </>
        )}

        {type === "image" && (
          <PropertySection title="Image">
            <PropertyInput
              label="Image URL"
              type="text"
              value={props.src}
              onChange={(value) => updateProp("src", value)}
            />
            <PropertyInput
              label="Alt Text"
              type="text"
              value={props.alt}
              onChange={(value) => updateProp("alt", value)}
            />
            <PropertyInput
              label="Object Fit"
              type="select"
              value={props.objectFit}
              options={[
                { value: "cover", label: "Cover" },
                { value: "contain", label: "Contain" },
                { value: "fill", label: "Fill" },
              ]}
              onChange={(value) => updateProp("objectFit", value)}
            />
          </PropertySection>
        )}

        {type === "video" && (
          <PropertySection title="Video">
            <PropertyInput
              label="Video URL"
              type="text"
              value={props.src}
              onChange={(value) => updateProp("src", value)}
            />
            <label className="flex items-center gap-2 font-mono text-sm">
              <input
                type="checkbox"
                checked={props.controls}
                onChange={(e) => updateProp("controls", e.target.checked)}
                className="checkbox checkbox-sm"
              />
              Show Controls
            </label>
            <label className="flex items-center gap-2 font-mono text-sm">
              <input
                type="checkbox"
                checked={props.autoplay}
                onChange={(e) => updateProp("autoplay", e.target.checked)}
                className="checkbox checkbox-sm"
              />
              Autoplay
            </label>
            <label className="flex items-center gap-2 font-mono text-sm">
              <input
                type="checkbox"
                checked={props.loop}
                onChange={(e) => updateProp("loop", e.target.checked)}
                className="checkbox checkbox-sm"
              />
              Loop
            </label>
          </PropertySection>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t-2 border-black">
        <button
          onClick={onDelete}
          className="w-full btn btn-error border-2 border-black font-mono font-bold"
        >
          Delete Component
        </button>
      </div>
    </div>
  );
}

function PropertySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-2 border-black p-3 bg-gray-50">
      <h3 className="font-mono font-bold text-sm mb-3 uppercase">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PropertyInput({
  label,
  type,
  value,
  onChange,
  options,
  min,
  max,
}: {
  label: string;
  type: string;
  value: any;
  onChange: (value: any) => void;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block font-mono text-xs font-bold mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="textarea textarea-bordered w-full text-sm font-mono border-2 border-black"
          rows={3}
        />
      ) : type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select select-bordered w-full text-sm font-mono border-2 border-black"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className="input input-bordered w-full text-sm font-mono border-2 border-black"
        />
      )}
    </div>
  );
}
