import { useSheetStore } from "../../store/useSheetStore";
import { Button } from "../ui/button";
import {
  Type,
  Heading1,
  Heading2,
  Image as ImageIcon,
  List,
  Square,
  Circle,
  BoxSelect,
  AlignVerticalSpaceAround,
  Minus,
  LayoutTemplate,
  Layers,
} from "lucide-react";

export const ToolsSidebar = () => {
  const { addBlock, toggleCompact, isCompact } = useSheetStore();

  // Helper to render tool buttons with uniform styles
  const ToolBtn = ({ icon: Icon, label, onClick }: any) => (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 h-9 px-2 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 font-normal"
      onClick={onClick}
    >
      <Icon size={16} />
      <span className="text-xs">{label}</span>
    </Button>
  );

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full z-10 transition-colors">
      {/* Scroll content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Group: Text */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
            Text
          </h3>
          <div className="space-y-1">
            <ToolBtn icon={Heading1} label="Big Title" onClick={() => addBlock("header", { level: 1 })} />
            <ToolBtn icon={Heading2} label="Subtitle" onClick={() => addBlock("header", { level: 2 })} />
            <ToolBtn icon={Type} label="Paragraph" onClick={() => addBlock("text")} />
            <ToolBtn icon={List} label="List" onClick={() => addBlock("list")} />
          </div>
        </div>

        {/* Group: Media & Forms */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
            Content
          </h3>
          <div className="space-y-1">
            <ToolBtn icon={ImageIcon} label="Image" onClick={() => addBlock("image")} />
            <ToolBtn icon={LayoutTemplate} label="Input" onClick={() => addBlock("form-box")} />
            <ToolBtn icon={Minus} label="Divisor" onClick={() => addBlock("divider")} />
          </div>
        </div>

        {/* Group: Structure */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
            Shapes and Groups
          </h3>
          <div className="space-y-1">
            <ToolBtn
              icon={Layers}
              label="Contenedor Grupo"
              onClick={() => addBlock("container", { zIndex: "back" })}
            />
            <ToolBtn
              icon={Square}
              label="Cuadrado"
              onClick={() => addBlock("shape", { shapeType: "square" })}
            />
            <ToolBtn
              icon={Circle}
              label="Círculo"
              onClick={() => addBlock("shape", { shapeType: "circle" })}
            />
          </div>
        </div>
      </div>

      {/* FOOTER: GRID TOOLS */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Grid Physics</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              isCompact ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
          >
            {isCompact ? "ON" : "OFF"}
          </span>
        </div>

        <Button
          onClick={toggleCompact}
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 text-xs border-dashed"
        >
          {isCompact ? <AlignVerticalSpaceAround size={14} /> : <BoxSelect size={14} />}
          {isCompact ? "Gravity On" : "Free Mode"}
        </Button>
      </div>
    </aside>
  );
};
