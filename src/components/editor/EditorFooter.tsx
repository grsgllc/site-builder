"use client";

interface EditorFooterProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function EditorFooter({ zoom, onZoomChange }: EditorFooterProps) {
  const ZOOM_MIN = 0.25;
  const ZOOM_MAX = 2.0;
  const ZOOM_STEP = 0.1;

  const handleZoomOut = () => {
    const newZoom = Math.max(ZOOM_MIN, zoom - ZOOM_STEP);
    onZoomChange(newZoom);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(ZOOM_MAX, zoom + ZOOM_STEP);
    onZoomChange(newZoom);
  };

  const handleReset = () => {
    onZoomChange(1.0);
  };

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="bg-black border-t-1 border-white grid auto-cols-min grid-flow-col justify-end font-mono">
      <div className="border-l-1 border-white flex items-center px-3 py-2">
        <div className="dropdown dropdown-top">
          <div tabIndex={0} role="button">
            {zoomPercentage}%
          </div>
          <ul
            tabIndex={-1}
            className="dropdown-content menu rounded-none bg-white text-black p-2 w-16 mb-2"
          >
            <li>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= ZOOM_MIN}
                title="Zoom out (Ctrl+Scroll)"
              >
                −
              </button>
            </li>
            <li>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= ZOOM_MAX}
                title="Zoom in (Ctrl+Scroll)"
              >
                +
              </button>
            </li>
            <li>
              <button onClick={handleReset} title="Reset zoom to 100%">
                ↺
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  return (
    <div className="grid auto-cols-min grid-flow-col border-t-1 border-white w-full">
      <div className="border-r-1 border-white flex items-center px-3">
        <div className="dropdown dropdown-top">
          <div tabIndex={0} role="button">
            {zoomPercentage}%
          </div>
          <ul tabIndex={-1} className="dropdown-content">
            <li>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= ZOOM_MIN}
                className="px-3 py-1 border-1 border-white bg-black text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white transition-colors"
                title="Zoom out (Ctrl+Scroll)"
              >
                −
              </button>
            </li>
            <li>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= ZOOM_MAX}
                className="px-3 py-1 border-1 border-white bg-black text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white transition-colors"
                title="Zoom in (Ctrl+Scroll)"
              >
                +
              </button>
            </li>
            <li>
              <button
                onClick={handleReset}
                className="px-3 py-1 border-1 border-white bg-black text-white hover:bg-white hover:text-black transition-colors ml-1"
                title="Reset zoom to 100%"
              >
                ↺
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-row items-center justify-center border-t-1 border-white h-10 bg-black text-white">
      <div className="flex items-center gap-2 font-mono text-sm">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= ZOOM_MIN}
          className="px-3 py-1 border-1 border-white bg-black text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white transition-colors"
          title="Zoom out (Ctrl+Scroll)"
        >
          −
        </button>

        <span className="px-2 min-w-[60px] text-center font-bold">
          {zoomPercentage}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= ZOOM_MAX}
          className="px-3 py-1 border-1 border-white bg-black text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white transition-colors"
          title="Zoom in (Ctrl+Scroll)"
        >
          +
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-1 border-1 border-white bg-black text-white hover:bg-white hover:text-black transition-colors ml-1"
          title="Reset zoom to 100%"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
