import { Grid3X3 } from "lucide-react";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { cn } from "../../lib/utils";
import { useSheetStore } from "../../store/useSheetStore";
import { BlockRenderer } from "./BlockRenderer";

// Grid will match with widthscreen
// TODO: Check this later
const ResponsiveGridLayout = WidthProvider(Responsive);

export const Canvas = () => {
  const { blocks, updateLayout, isCompact } = useSheetStore();
  const [showGrid, setShowGrid] = useState(true);
  // Layout memoization to avoid re renders
  // RGL needs a clean array of objects with {i, x, y, w, h}
  const layout = useMemo(() => blocks.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })), [blocks]);

  return (
    <div className="flex justify-center min-h-full pb-20">
      {/* Button to activate/desactivate visual grid */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-black border z-50 flex gap-2 items-center text-xs"
      >
        <Grid3X3 size={16} /> {showGrid ? "Hide Grid" : "Show Grid"}
      </button>

      {/* Sheet */}
      <div
        className={cn(
          "bg-white w-[800px] min-h-[1100px] h-fit shadow-2xl relative transition-all rounded-xl",
          showGrid ? "bg-graph-paper" : "bg-white text-black"
        )}
      >
        <ResponsiveGridLayout
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          compactType={isCompact ? "vertical" : null}
          draggableCancel=".nodrag"
          isDraggable={true}
          isResizable={true}
          layouts={{ lg: layout }}
          onLayoutChange={(currentLayout) => updateLayout(currentLayout)}
          preventCollision={isCompact ? false : true} // To make the block push each other
          rowHeight={30} // Height of each cell in the grid
        >
          {blocks.map((block) => {
            let zIndexClass = "z-10"; // Default (Middle)
            if (block.type === "container" || block.config?.zIndex === "back") zIndexClass = "!z-0";
            if (block.config?.zIndex === "front") zIndexClass = "!z-20";
            return (
              <div
                key={block.i}
                className="bg-white border border-transparent hover:border-blue-300 shadow-sm rounded transition-colors group overflow-hidden"
              >
                <BlockRenderer block={block} />
                {/* Optional size indicator */}
                <span className="absolute bottom-0 right-0 p-1 text-[8px] text-gray-300 opacity-0 group-hover:opacity-100">
                  RGL Handle
                </span>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
