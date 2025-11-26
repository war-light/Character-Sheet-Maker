import { cn } from "@/lib/utils";
import {
  AlignVerticalSpaceAround,
  BoxSelect,
  Circle,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  List,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Square,
  Type,
} from "lucide-react";
import { THEMES, type ThemeKey } from "../../lib/themes";
import { useSheetStore } from "../../store/useSheetStore";
import { Button } from "../ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export const ToolsSidebar = ({ isOpen, toggle }: SidebarProps) => {
  const { addBlock, toggleCompact, isCompact, globalStyle, setTheme } = useSheetStore();

  // Helper to render tool buttons with uniform styles and collapse logic
  const ToolBtn = ({ icon: Icon, label, onClick }: any) => (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full h-9 px-2 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 font-normal transition-all",
        // Alignment changes based on state
        isOpen ? "justify-start gap-3" : "justify-center"
      )}
      // Native tooltip for when sidebar is collapsed
      title={!isOpen ? label : undefined}
    >
      <Icon size={18} />
      {/* Text visibility transition */}
      <span
        className={cn(
          "text-xs transition-all duration-200 overflow-hidden whitespace-nowrap",
          isOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
        )}
      >
        {label}
      </span>
    </Button>
  );

  // Helper for Section Titles (Hides when collapsed)
  const SectionTitle = ({ children }: { children: string }) => (
    <h3
      className={cn(
        "text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2 transition-all duration-300 whitespace-nowrap overflow-hidden",
        isOpen ? "opacity-100 h-auto mt-4" : "opacity-0 h-0 mt-0"
      )}
    >
      {children}
    </h3>
  );

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full z-10 transition-all duration-300 ease-in-out relative",
        // Dynamic width
        isOpen ? "w-64" : "w-14"
      )}
    >
      {/* COLLAPSE BUTTON (Floating on the edge) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="absolute -right-3 top-3 h-6 w-6 rounded-full border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm z-50 hover:bg-indigo-50 text-gray-500 p-0"
      >
        {isOpen ? <PanelLeftClose size={12} /> : <PanelLeftOpen size={12} />}
      </Button>

      {/* SCROLLABLE CONTENT */}
      <div
        className={cn("flex-1 overflow-y-auto overflow-x-hidden space-y-2 py-3", isOpen ? "px-3" : "px-1")}
      >
        {/* GROUP: SHEET STYLES */}
        <div className="mb-2">
          <SectionTitle>Sheet Style</SectionTitle>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(THEMES) as ThemeKey[]).map((themeKey) => (
              <Button
                key={themeKey}
                variant={globalStyle.theme === themeKey ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme(themeKey)}
                title={!isOpen ? THEMES[themeKey].name : undefined}
                className={cn(
                  "font-normal capitalize dark:text-white hover:bg-gray-400 dark:hover:bg-gray-800 transition-all",
                  isOpen ? "justify-start" : "justify-center px-0",
                  globalStyle.theme === themeKey &&
                    "bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700"
                )}
              >
                {/* Show first letter if collapsed, full name if open */}
                {isOpen ? (
                  THEMES[themeKey].name
                ) : (
                  <span className="font-bold">{THEMES[themeKey].name.charAt(0)}</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* GROUP: TEXT */}
        <div>
          <SectionTitle>Text</SectionTitle>
          <div className="space-y-1">
            <ToolBtn icon={Heading1} label="Big Title" onClick={() => addBlock("header", { level: 1 })} />
            <ToolBtn icon={Heading2} label="Subtitle" onClick={() => addBlock("header", { level: 2 })} />
            <ToolBtn icon={Type} label="Paragraph" onClick={() => addBlock("text")} />
            <ToolBtn icon={List} label="List" onClick={() => addBlock("list")} />
          </div>
        </div>

        {/* GROUP: MEDIA & FORMS */}
        <div>
          <SectionTitle>Content</SectionTitle>
          <div className="space-y-1">
            <ToolBtn icon={ImageIcon} label="Image" onClick={() => addBlock("image")} />
            <ToolBtn icon={LayoutTemplate} label="Input" onClick={() => addBlock("form-box")} />
            <ToolBtn icon={Minus} label="Divisor" onClick={() => addBlock("divider")} />
          </div>
        </div>

        {/* GROUP: STRUCTURE */}
        <div>
          <SectionTitle>Shapes & Groups</SectionTitle>
          <div className="space-y-1">
            <ToolBtn
              icon={Layers}
              label="Group Container"
              onClick={() => addBlock("container", { zIndex: "back" })}
            />
            <ToolBtn
              icon={Square}
              label="Square"
              onClick={() => addBlock("shape", { shapeType: "square" })}
            />
            <ToolBtn
              icon={Circle}
              label="Circle"
              onClick={() => addBlock("shape", { shapeType: "circle" })}
            />
          </div>
        </div>
      </div>

      {/* FOOTER: GRID PHYSICS */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        {/* Header hides when collapsed */}
        <div
          className={cn(
            "flex items-center justify-between mb-2 overflow-hidden transition-all duration-200",
            isOpen ? "opacity-100 h-auto" : "opacity-0 h-0"
          )}
        >
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Physics</span>
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
          title={isOpen ? "" : isCompact ? "Gravity On" : "Free Mode"}
          className={cn(
            "w-full gap-2 text-xs border-dashed transition-all dark:text-white",
            isOpen ? "justify-center" : "justify-center px-0"
          )}
        >
          {isCompact ? <AlignVerticalSpaceAround size={14} /> : <BoxSelect size={14} />}
          <span className={cn(isOpen ? "inline" : "hidden")}>{isCompact ? "Gravity On" : "Free Mode"}</span>
        </Button>
      </div>
    </aside>
  );
};
