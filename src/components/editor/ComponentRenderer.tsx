"use client";

interface ComponentRendererProps {
  component: any;
  isEditor?: boolean;
}

export function ComponentRenderer({
  component,
  isEditor = false,
}: ComponentRendererProps) {
  const { type, props } = component;

  switch (type) {
    case "text":
      return (
        <div
          style={{
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            color: props.color,
            fontFamily: props.fontFamily,
          }}
          className="p-2"
        >
          {props.content}
        </div>
      );

    case "heading":
      const Tag = `h${props.level}` as keyof JSX.IntrinsicElements;
      return (
        <Tag
          style={{
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            color: props.color,
            fontFamily: props.fontFamily,
          }}
          className="p-2"
        >
          {props.content}
        </Tag>
      );

    case "image":
      return (
        <div
          className="border-4 border-black overflow-hidden"
          style={{ width: "100%", height: "100%" }}
        >
          {props.src ? (
            <img
              src={props.src}
              alt={props.alt || "Image"}
              style={{ width: "100%", height: "100%", objectFit: props.objectFit }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="font-mono font-bold text-gray-600">
                No image
              </span>
            </div>
          )}
        </div>
      );

    case "button":
      return (
        <button
          style={{
            backgroundColor: props.backgroundColor,
            color: props.color,
            borderColor: props.borderColor,
            borderWidth: `${props.borderWidth}px`,
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            borderStyle: "solid",
          }}
          className="px-6 py-3 font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          onClick={
            isEditor ? (e) => e.preventDefault() : undefined
          }
        >
          {props.text}
        </button>
      );

    case "video":
      return (
        <div className="border-4 border-black">
          {props.src ? (
            <video
              src={props.src}
              controls={props.controls}
              autoPlay={props.autoplay}
              loop={props.loop}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <span className="font-mono font-bold text-gray-600">
                No video
              </span>
            </div>
          )}
        </div>
      );

    case "gallery":
      return (
        <div className="grid grid-cols-3 gap-4 border-4 border-black p-4 bg-white">
          {props.images?.length > 0 ? (
            props.images.map((img: string, i: number) => (
              <div key={i} className="border-2 border-black aspect-square">
                <img
                  src={img}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 p-8 bg-gray-200 text-center">
              <span className="font-mono font-bold">Empty Gallery</span>
            </div>
          )}
        </div>
      );

    case "carousel":
      return (
        <div className="border-4 border-black bg-white p-4">
          <div className="aspect-video bg-gray-300 flex items-center justify-center">
            <span className="font-mono font-bold">Carousel Placeholder</span>
          </div>
        </div>
      );

    case "embed":
      return (
        <div className="border-4 border-black bg-black p-4">
          {props.embedCode ? (
            <div dangerouslySetInnerHTML={{ __html: props.embedCode }} />
          ) : (
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <span className="font-mono font-bold text-white">
                No embed code
              </span>
            </div>
          )}
        </div>
      );

    case "animated-text":
      return (
        <div
          className="p-4 font-mono font-bold text-4xl"
          style={{ color: props.color || "#000" }}
        >
          {props.content || "Animated Text"}
        </div>
      );

    case "parallax":
      return (
        <div
          className="border-4 border-black p-8 bg-gradient-to-b from-purple-500 to-pink-500"
          style={{ minHeight: "300px" }}
        >
          <div className="font-mono font-bold text-white text-2xl">
            Parallax Section
          </div>
        </div>
      );

    case "particles":
      return (
        <div className="border-4 border-black bg-black p-8 relative overflow-hidden">
          <div className="font-mono font-bold text-white text-2xl relative z-10">
            Particle Background
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 border-2 border-dashed border-gray-400 bg-gray-100">
          <span className="font-mono text-sm">Unknown: {type}</span>
        </div>
      );
  }
}
