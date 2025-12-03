import { GripHorizontal, MinusCircle, Plus, Trash2, X } from "lucide-react";
import { THEMES } from "../../lib/themes";
import { cn } from "../../lib/utils";
import { useSheetStore, type Block } from "../../store/useSheetStore";
import { Input } from "../ui/input";

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
    const items = (block.data?.items as string[]) || ["Item 1", "Item 2"];

    const updateItem = (index: number, val: string) => {
      const newItems = [...items];
      newItems[index] = val;
      updateBlockData(block.i, { items: newItems });
    };

    const addItem = () => updateBlockData(block.i, { items: [...items, ""] });

    const removeItem = (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      updateBlockData(block.i, { items: newItems });
    };

    // Handle Enter key to add new item automatically
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addItem();
        // In a clearer implementation, we would set focus to the new input here
      }
      if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
        e.preventDefault();
        removeItem(index);
      }
    };
    return (
      <div className="w-full h-full group relative flex flex-col">
        <DeleteBtn />

        {/* Container for the joined inputs */}
        <div className={cn("flex flex-col w-full", currentTheme.blocks.list.container)}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                currentTheme.blocks.list.row, // Row base style
                currentTheme.blocks.list.divider // Divider between rows
              )}
            >
              {/* Bullet / Number */}
              <span className={cn("shrink-0 w-4 text-center", currentTheme.blocks.list.bullet)}>
                {idx + 1}.
              </span>

              {/* Input Content */}
              <input
                className={cn(
                  "flex-1 bg-transparent border-none focus:outline-none text-sm nodrag min-w-0",
                  currentTheme.colors.text
                )}
                style={{ fontFamily: currentTheme.fonts.body }}
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                placeholder="..."
              />

              {/* Individual delete button (visible on hover) */}
              <button
                onClick={() => removeItem(idx)}
                className={cn(
                  "nodrag opacity-0 group-hover/row:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1",
                  items.length <= 1 && "hidden" // Don't allow deleting the last item via this button
                )}
              >
                <MinusCircle size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Button (Bottom) */}
        <button
          onClick={addItem}
          className={cn(
            "mt-1 self-start text-[10px] flex items-center gap-1 nodrag px-2 py-1 rounded opacity-60 hover:opacity-100 transition-all",
            currentTheme.colors.accent
          )}
        >
          <Plus size={10} /> Add Row
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
            "w-full h-full resize-none bg-transparent border-none focus:outline-none text-sm p-1 nodrag overflow-clip",
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
