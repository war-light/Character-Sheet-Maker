import { GripHorizontal, Plus, Trash2, X } from "lucide-react";
import { THEMES } from "../../lib/themes";
import { cn } from "../../lib/utils";
import { useSheetStore, type Block } from "../../store/useSheetStore";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const BlockRenderer = ({ block }: { block: Block }) => {
  const { updateBlockData, removeBlock, globalStyle } = useSheetStore();

  // Get the current theme configuration object
  const currentTheme = THEMES[globalStyle.theme];

  // Helper to delete block (Used for every type of block)
  const DeleteBtn = () => (
    <button
      onClick={() => removeBlock(block.i)}
      className="nodrag absolute -top-2 -right-2 z-50 bg-white shadow-md border rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
    >
      <X size={12} />
    </button>
  );

  // --- 1. HEADERS (H1, H2, H3) ---
  if (block.type === "header") {
    const level = block.config?.level || 1;

    // Select the class from the theme based on level
    const themeClass = level === 1 ? currentTheme.blocks.header.h1 : currentTheme.blocks.header.h2;

    return (
      <div className="w-full h-full group relative flex items-end">
        <DeleteBtn />
        <input
          className={cn(
            "w-full bg-transparent border-none focus:outline-none nodrag",
            themeClass, // Theme specific font-weight, borders, spacing
            currentTheme.colors.text // Theme specific color
          )}
          style={{ fontFamily: currentTheme.fonts.heading }}
          placeholder={`Encabezado ${level}`}
          value={block.data?.text || ""}
          onChange={(e) => updateBlockData(block.i, { text: e.target.value })}
        />
      </div>
    );
  }

  // --- 2. FORM BOX (Label + Input) ---
  if (block.type === "form-box") {
    return (
      <div className="w-full h-full group relative flex flex-col">
        <DeleteBtn />
        {/* Editable label */}
        <input
          className={cn(
            "w-full bg-transparent border-none focus:outline-none nodrag mb-1",
            currentTheme.blocks.formBox.label // Label style (uppercase, spacing, etc)
          )}
          style={{ fontFamily: currentTheme.fonts.heading }}
          placeholder="ETIQUETA"
          value={block.data?.label || ""}
          onChange={(e) => updateBlockData(block.i, { label: e.target.value })}
        />
        {/* Input area */}
        <textarea
          className={cn(
            "flex-1 w-full p-2 resize-none text-sm nodrag",
            currentTheme.blocks.formBox.input, // Input style (background, border radius/skew)
            currentTheme.colors.text
          )}
          style={{ fontFamily: currentTheme.fonts.body }}
          placeholder="..."
          value={block.data?.value || ""}
          onChange={(e) => updateBlockData(block.i, { value: e.target.value })}
        />
      </div>
    );
  }

  // --- 3. SHAPES (Decoration) ---
  if (block.type === "shape") {
    const shape = block.config?.shapeType || "square";

    // Base style comes from theme
    let shapeClass = currentTheme.blocks.shape;

    // Modifiers based on config
    if (shape === "circle") shapeClass = cn(shapeClass, "rounded-full");
    if (shape === "rounded") shapeClass = cn(shapeClass, "rounded-xl");

    // Special case for Heart (Icon instead of div)
    if (shape === "heart")
      return (
        <div
          className={cn(
            "text-6xl flex items-center justify-center h-full w-full group relative",
            currentTheme.colors.accent
          )}
        >
          ♥ <DeleteBtn />
        </div>
      );

    return (
      <div className={cn("w-full h-full relative group transition-colors", shapeClass)}>
        <DeleteBtn />
        {/* Helper text only visible on hover */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 pointer-events-none",
            currentTheme.colors.faint
          )}
        >
          Shape
        </div>
      </div>
    );
  }

  // --- 4. DIVIDER LINES ---
  if (block.type === "divider") {
    return (
      <div className="w-full h-full flex items-center justify-center group relative">
        <DeleteBtn />
        {/* The line itself, styled by theme */}
        <div className={cn("w-full", currentTheme.blocks.divider)}></div>
      </div>
    );
  }

  // --- 5. CONTAINER FOR GROUPS (VISUAL BG) ---
  if (block.type === "container") {
    return (
      <div className={cn("w-full h-full relative group -z-10 transition-all", currentTheme.blocks.container)}>
        <DeleteBtn />
        <span
          className={cn(
            "absolute top-1 left-1 text-[10px] font-bold uppercase tracking-wider pointer-events-none",
            currentTheme.colors.faint
          )}
        >
          Group
        </span>
      </div>
    );
  }

  // --- 6. LISTS ---
  if (block.type === "list") {
    const items = (block.data?.items as string[]) || ["Elemento 1", "Elemento 2"];

    const updateItem = (index: number, val: string) => {
      const newItems = [...items];
      newItems[index] = val;
      updateBlockData(block.i, { items: newItems });
    };

    const addItem = () => updateBlockData(block.i, { items: [...items, ""] });

    return (
      <div className="w-full h-full group relative overflow-y-auto">
        <DeleteBtn />
        <ul className={cn("list-disc pl-5 space-y-1", currentTheme.colors.text)}>
          {items.map((item, idx) => (
            <li key={idx} className={cn("marker:opacity-50", currentTheme.colors.faint)}>
              <input
                className={cn(
                  "w-full bg-transparent border-none focus:outline-none text-sm nodrag border-b border-transparent focus:border-gray-200",
                  currentTheme.colors.text
                )}
                style={{ fontFamily: currentTheme.fonts.body }}
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={addItem}
          className={cn(
            "mt-2 text-xs flex items-center gap-1 nodrag hover:underline opacity-50 hover:opacity-100",
            currentTheme.colors.accent
          )}
        >
          <Plus size={10} /> Add item
        </button>
      </div>
    );
  }

  // --- 7. IMAGES ---
  if (block.type === "image") {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateBlockData(block.i, { src: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="h-full w-full relative group overflow-hidden rounded bg-gray-50/50 border border-transparent hover:border-gray-300 transition-colors flex flex-col">
        {/* Delete button */}
        <button
          onClick={() => removeBlock(block.i)}
          className="absolute top-1 right-1 z-20 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <X size={14} />
        </button>

        {block.data?.src ? (
          <img
            src={block.data.src}
            alt="Character"
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-2 text-center">
            <span className="text-xs mb-2">Drag or Click</span>
            <Input
              type="file"
              accept="image/*"
              className="nodrag text-xs opacity-70 hover:opacity-100"
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>
    );
  }

  // --- 8. FREE TEXT ---
  if (block.type === "text") {
    return (
      <div className="h-full w-full relative group p-1">
        <DeleteBtn />
        <textarea
          style={{ fontFamily: currentTheme.fonts.body }}
          className={cn(
            "w-full h-full resize-none bg-transparent border-none focus:outline-none text-sm p-1 nodrag",
            currentTheme.colors.text // Applies theme color
          )}
          placeholder="Write notes, story or descriptions here..."
          value={block.data?.text || ""}
          onChange={(e) => updateBlockData(block.i, { text: e.target.value })}
        />
      </div>
    );
  }

  return <div className="p-2 text-red-500 text-xs">Unknown Block Type</div>;
};
