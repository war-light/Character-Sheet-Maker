import type { ThemeKey } from "@/lib/themes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// TODO: Themes will be expanded in the future,
//       it will be necesary to build a better infrastructure

// Global settings
export interface SheetStyle {
  theme: ThemeKey;
  fonts: {
    h1: string; // Ej: 'Cinzel'
    h2: string; // Ej: 'Roboto Slab'
    h3: string;
    body: string; // Normal text and inputs
  };
}
// Definition of blocks in grid to set the way the look like
export interface Block {
  i: string; // UID, required by RGL
  x: number;
  y: number;
  w: number;
  h: number;
  type: "text" | "image" | "header" | "form-box" | "shape" | "divider" | "list" | "container";
  data?: any; // The real content (text, url image, values)
  config?: {
    level?: 1 | 2 | 3;
    shapeType?: "square" | "circle" | "rounded" | "heart";
    label?: string;
    zIndex?: "back" | "middle" | "front";
    // Any other config props
  };
}

interface SheetState {
  blocks: Block[];
  addBlock: (type: Block["type"], config?: Block["config"]) => void;
  isCompact: boolean;
  removeBlock: (id: string) => void;
  toggleCompact: () => void;
  updateBlockData: (id: string, data: any) => void;
  updateLayout: (layout: any[]) => void;
  setGlobalFont: (tag: keyof SheetStyle["fonts"], fontName: string) => void;
  setTheme: (theme: ThemeKey) => void;
  globalStyle: {
    theme: SheetStyle["theme"];
    fonts: { h1: string; h2: string; h3: string; body: string };
  };
}

export const useSheetStore = create<SheetState>()(
  persist(
    (set) => ({
      // Example block
      // TODO: Remove for production
      blocks: [
        {
          i: "1",
          x: 0,
          y: 0,
          w: 4,
          h: 2,
          type: "text",
          data: { text: "Character Name" },
        },
      ],
      globalStyle: {
        theme: "simple", // Default
        fonts: { h1: "serif", h2: "serif", h3: "serif", body: "sans-serif" },
      },

      isCompact: false, // Start in false

      toggleCompact: () => set((state) => ({ isCompact: !state.isCompact })),
      setGlobalFont: (tag, fontName) =>
        set((state) => ({
          globalStyle: {
            ...state.globalStyle,
            fonts: { ...state.globalStyle.fonts, [tag]: fontName },
          },
        })),
      setTheme: (theme) =>
        set((state) => ({
          globalStyle: { ...state.globalStyle, theme },
        })),
      addBlock: (type, config = {}) =>
        set((state) => {
          const newId = crypto.randomUUID();
          return {
            blocks: [
              ...state.blocks,
              {
                i: newId,
                x: 0, // RGL will search the first empty space avaliable
                y: Infinity,
                w: 4,
                h: 2,
                type,
                config: { zIndex: "middle", ...config }, // Middle layer by default
                data: {},
              },
            ],
          };
        }),

      updateLayout: (newLayout) =>
        set((state) => {
          // Sincronizamos la posición x,y,w,h de RGL con nuestro estado
          const updatedBlocks = state.blocks.map((block) => {
            const layoutItem = newLayout.find((l) => l.i === block.i);
            if (layoutItem) {
              return {
                ...block,
                x: layoutItem.x,
                y: layoutItem.y,
                w: layoutItem.w,
                h: layoutItem.h,
              };
            }
            return block;
          });
          return { blocks: updatedBlocks };
        }),
      updateBlockData: (id, data) =>
        set((state) => ({
          blocks: state.blocks.map((b) => (b.i === id ? { ...b, data: { ...b.data, ...data } } : b)),
        })),
      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.i !== id),
        })),
    }),
    { name: "rpg-sheet-storage" } // AutoSave in localStorage
  )
);
