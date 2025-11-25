import { X, GripHorizontal, Plus, Trash2 } from "lucide-react";
import { useSheetStore, type Block } from "../../store/useSheetStore";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

export const BlockRenderer = ({ block }: { block: Block }) => {
  const { updateBlockData, removeBlock, globalStyle } = useSheetStore();

  // Helper to delete block (Used for every type of block)
  const DeleteBtn = () => (
    <button
      onClick={() => removeBlock(block.i)}
      className="nodrag absolute -top-2 -right-2 z-50 bg-white shadow-md border rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X size={12} />
    </button>
  );

  // --- 1. HEADERS (H1, H2, H3) ---
  if (block.type === "header") {
    const level = block.config?.level || 1;
    // Seleccionamos la fuente global correspondiente
    const fontKey = `h${level}` as keyof typeof globalStyle.fonts;
    const fontFamily = globalStyle.fonts[fontKey];

    const sizeClasses = {
      1: "text-4xl font-extrabold border-b-2 border-black pb-1",
      2: "text-2xl font-bold border-b border-gray-400",
      3: "text-lg font-bold uppercase tracking-wide text-gray-600",
    };

    return (
      <div className="w-full h-full group relative flex items-end">
        <DeleteBtn />
        <input
          className={cn("w-full bg-transparent border-none focus:outline-none nodrag", sizeClasses[level])}
          style={{ fontFamily }}
          placeholder={`Encabezado H${level}`}
          value={block.data?.text || ""}
          onChange={(e) => updateBlockData(block.i, { text: e.target.value })}
        />
      </div>
    );
  }

  // --- FORM BOX (Label + Input) ---
  if (block.type === "form-box") {
    return (
      <div className="w-full h-full group relative flex flex-col">
        <DeleteBtn />
        {/* Editable label */}
        <input
          className="text-xs font-bold uppercase text-gray-500 bg-transparent border-none focus:outline-none nodrag mb-1 w-full"
          style={{ fontFamily: globalStyle.fonts.body }}
          placeholder="ETIQUETA"
          value={block.data?.label || ""}
          onChange={(e) => updateBlockData(block.i, { label: e.target.value })}
        />
        {/* Input */}
        <textarea
          className="flex-1 w-full bg-white/50 border border-gray-300 rounded-sm focus:border-black focus:outline-none p-1 resize-none text-sm nodrag"
          style={{ fontFamily: globalStyle.fonts.body }}
          placeholder="..."
          value={block.data?.value || ""}
          onChange={(e) => updateBlockData(block.i, { value: e.target.value })}
        />
      </div>
    );
  }

  // --- 6. SHAPES (Decoration) ---
  if (block.type === "shape") {
    const shape = block.config?.shapeType || "square";

    let shapeClass = "bg-gray-200 border-2 border-gray-400";
    if (shape === "circle") shapeClass += " rounded-full";
    if (shape === "rounded") shapeClass += " rounded-xl";
    if (shape === "heart")
      return (
        <div className="text-red-500 text-6xl flex items-center justify-center">
          ♥ <DeleteBtn />
        </div>
      ); // Simplified Example

    return (
      <div className={cn("w-full h-full relative group transition-colors", shapeClass)}>
        <DeleteBtn />
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs opacity-0 group-hover:opacity-100 pointer-events-none">
          Shape
        </div>
      </div>
    );
  }

  // --- DIVIDER LINES ---
  if (block.type === "divider") {
    return (
      <div className="w-full h-full flex items-center justify-center group relative">
        <DeleteBtn />
        <div className="w-full h-0.5 bg-black rounded-full"></div>
      </div>
    );
  }

  // --- CONTAINER FOR GROUPS (VISUAL BG) ---
  if (block.type === "container") {
    return (
      <div className="w-full h-full border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-lg group relative -z-10">
        <DeleteBtn />
        <span className="absolute top-1 left-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider pointer-events-none">
          Group
        </span>
      </div>
    );
  }

  // --- LISTS ---
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
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="marker:text-gray-400">
              <input
                className="w-full bg-transparent border-none focus:outline-none text-sm nodrag border-b border-transparent focus:border-gray-200"
                style={{ fontFamily: globalStyle.fonts.body }}
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={addItem}
          className="mt-2 text-xs text-blue-500 flex items-center gap-1 nodrag hover:underline"
        >
          <Plus size={10} /> Add item
        </button>
      </div>
    );
  }

  // --- IMAGES ---
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
      <div className="h-full w-full relative group overflow-hidden rounded bg-gray-50 flex flex-col">
        {/* Delete button */}
        <button
          onClick={() => removeBlock(block.i)}
          className="absolute top-1 right-1 z-20 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <span className="text-xs mb-2">Arrastra o click</span>
            <Input type="file" accept="image/*" className="nodrag text-xs" onChange={handleImageUpload} />
          </div>
        )}
      </div>
    );
  }

  // --- FREE TEXT ---
  if (block.type === "text") {
    return (
      <div className="h-full w-full relative group p-2">
        {/* Delete Button */}
        {/* Must have nodrag class! */}
        <button
          onClick={() => removeBlock(block.i)}
          className="nodrag absolute top-0 right-0 z-20 text-red-500 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"
        >
          <X size={14} />
        </button>

        <textarea
          className="nodrag w-full h-full resize-none bg-transparent border-none focus:outline-none text-sm p-1"
          placeholder="Escribe aquí notas, historia o descripciones..."
          value={block.data?.text || ""}
          onChange={(e) => updateBlockData(block.i, { text: e.target.value })}
        />
      </div>
    );
  }

  return <div className="p-2 text-red-500">Unknown Type</div>;
};
