// src/pages/Editor.tsx
import { useState } from "react";
import { ToolsSidebar } from "../components/layout/ToolsSidebar";
import { TopBar } from "../components/layout/TopBar";
import { Canvas } from "../components/sheet/Canvas";

export const Editor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* 1. Global top bar */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Lateral tool bar */}
        <ToolsSidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* 3. Main area (Canvas) */}
        <main className="flex-1 overflow-auto relative flex flex-col">
          <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8 transition-colors">
            <Canvas />
          </div>
        </main>
      </div>
    </div>
  );
};
