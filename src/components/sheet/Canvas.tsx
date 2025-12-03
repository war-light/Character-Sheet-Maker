import { Grid3X3 } from "lucide-react";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useKeyPress } from "../../hooks/useKeyPress";
import { cn } from "../../lib/utils";
import { useSheetStore } from "../../store/useSheetStore";
import { BlockRenderer } from "./BlockRenderer";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Canvas = () => {
  // Global Store State
  const { blocks, updateLayout, isCompact } = useSheetStore();

  // Grid in the background of the sheet
  const [showGrid, setShowGrid] = useState(true);

  // Holding Ctrl allows to drag elements
  const isCtrlPressed = useKeyPress("Control");

  // Memoize layout to prevent unnecessary re-renders in RGL
  // RGL expects a clean array of objects with {i, x, y, w, h}
  const layout = useMemo(() => blocks.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })), [blocks]);

  return (
    <div className="flex justify-center min-h-full pb-20">
      {/* Toggle Visual Grid Button */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-black border z-50 flex gap-2 items-center text-xs"
      >
        <Grid3X3 size={16} /> {showGrid ? "Hide Grid" : "Show Grid"}
      </button>

      {/* Main Sheet Container (The Paper) */}
      <div
        id="rpg-sheet-canvas"
        className={cn(
          "w-[800px] min-w-[800px] min-h-[1100px] h-fit shadow-2xl relative transition-all rounded-xl",
          showGrid ? "bg-graph-paper" : "bg-white text-black"
        )}
      >
        <ResponsiveGridLayout
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          compactType={isCompact ? "vertical" : null}
          // Vital: Prevents dragging when interacting with inputs unless using the Ctrl overlay
          draggableCancel=".nodrag"
          isDraggable={true}
          isResizable={true}
          layouts={{ lg: layout }}
          onLayoutChange={(currentLayout) => updateLayout(currentLayout)}
          // In Free Mode (!isCompact), prevent blocks from pushing each other automatically
          preventCollision={!isCompact}
          rowHeight={30}
          margin={[10, 10]}
        >
          {blocks.map((block) => {
            // Determine Layering (Z-Index) and Background Transparency
            let zIndexClass = "z-10"; // Default: Middle Layer
            let bgClass = "bg-white"; // Default: White Background

            // Logic for Background/Bottom Layer elements
            if (block.type === "container" || block.config?.zIndex === "back") {
              zIndexClass = "!z-0";
              bgClass = "bg-transparent"; // Crucial: must be transparent to see through
            }

            // Shapes are usually transparent decorations
            if (block.type === "shape") {
              bgClass = "bg-transparent";
            }

            // Logic for Front Layer elements
            if (block.config?.zIndex === "front") {
              zIndexClass = "!z-20";
            }

            return (
              <div
                key={block.i}
                className={cn(
                  "border border-transparent hover:border-blue-300/50 shadow-sm rounded transition-colors group overflow-visible",
                  bgClass,
                  zIndexClass,
                  // Visual feedback when Ctrl is pressed to indicate "Drag Mode"
                  isCtrlPressed ? "cursor-grab ring-2 ring-indigo-400 ring-opacity-50" : ""
                )}
              >
                <BlockRenderer block={block} />

                {/* Drag Overlay: Only visible when CTRL is pressed */}
                {/* This allows the user to click "through" inputs to drag the whole block */}
                {isCtrlPressed && (
                  <div className="absolute inset-0 z-100 bg-indigo-500/10 rounded flex items-center justify-center pointer-events-auto backdrop-blur-[.5px]">
                    <span className="bg-indigo-300 text-white text-[10px] px-2 py-1 rounded shadow font-bold select-none">
                      DRAG
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
