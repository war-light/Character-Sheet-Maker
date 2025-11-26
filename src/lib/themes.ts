export type ThemeKey = "simple" | "medieval" | "cyberpunk";

// Theme structure
interface ThemeConfig {
  name: string;
  fonts: {
    heading: string; // Fonts for headers
    body: string; // Fonts for text and inputs
  };
  colors: {
    text: string; // Text main color
    accent: string; // Color for active borders and details
    faint: string; // Color for placeholders and soft borders
  };
  // Specific styles for each type of block
  blocks: {
    header: {
      h1: string;
      h2: string;
    };
    formBox: {
      label: string;
      input: string;
    };
    container: string;
    divider: string;
    shape: string;
  };
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  // --- THEME 1: MODERN / SIMPLE ---
  simple: {
    name: "Modern Clean",
    fonts: {
      heading: '"Inter", sans-serif',
      body: '"Inter", sans-serif',
    },
    colors: {
      text: "text-gray-900",
      accent: "text-blue-600",
      faint: "text-gray-400",
    },
    blocks: {
      header: {
        h1: "font-extrabold text-4xl border-b-2 border-gray-900 pb-2 tracking-tight",
        h2: "font-bold text-2xl text-gray-700",
      },
      formBox: {
        label: "font-bold text-xs uppercase tracking-wider text-gray-500",
        input:
          "bg-gray-50 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      },
      container: "border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-lg",
      divider: "bg-gray-200 h-[1px]",
      shape: "bg-gray-100 border-2 border-gray-300",
    },
  },

  // --- MEDIEVAL / FANTASY ---
  medieval: {
    name: "Ancient Scroll",
    fonts: {
      heading: '"Cinzel", serif',
      body: '"Crimson Text", serif',
    },
    colors: {
      text: "text-amber-950", // Dark brown
      accent: "text-red-800", // Dark blood
      faint: "text-amber-900/40",
    },
    blocks: {
      header: {
        h1: "font-black text-5xl border-b-4 border-double border-amber-900/50 pb-1 text-center uppercase tracking-widest",
        h2: "font-bold text-3xl border-b border-amber-900/30 text-amber-900 italic",
      },
      formBox: {
        label: "font-serif font-bold text-sm text-amber-800 tracking-widest",
        input:
          "bg-transparent border-b-2 border-amber-900/30 rounded-none focus:border-amber-900 font-serif italic",
      },
      container: "border-4 border-double border-amber-900/20 bg-amber-50/30 rounded-sm",
      divider: "bg-amber-900/40 h-[2px]",
      shape: "bg-transparent border-2 border-amber-900 rounded-sm",
    },
  },

  // --- CYBERPUNK / SCI-FI ---
  cyberpunk: {
    name: "Neon Future",
    fonts: {
      heading: '"Orbitron", sans-serif',
      body: '"Share Tech Mono", monospace',
    },
    colors: {
      text: "text-cyan-900", // Blue ish dark
      accent: "text-pink-600",
      faint: "text-cyan-900/30",
    },
    blocks: {
      header: {
        h1: "font-black text-4xl border-l-8 border-pink-500 pl-4 uppercase tracking-tighter bg-gradient-to-r from-pink-500/10 to-transparent",
        h2: "font-bold text-2xl text-cyan-700 uppercase border-b border-cyan-500/50",
      },
      formBox: {
        label: "font-bold text-[10px] text-pink-600 uppercase mb-0.5",
        input:
          "bg-cyan-50/50 border border-cyan-400/50 rounded-none focus:bg-cyan-100/50 focus:border-pink-500 focus:outline-none skew-x-[-10deg]", // Skew for tech
      },
      container:
        "border border-cyan-500 bg-cyan-900/5 rounded-none relative after:content-[''] after:absolute after:top-0 after:left-0 after:w-2 after:h-2 after:bg-cyan-500",
      divider: "bg-pink-500 h-[3px] shadow-[0_0_5px_rgba(236,72,153,0.5)]",
      shape: "bg-transparent border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
    },
  },
};
