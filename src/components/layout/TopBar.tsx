import { Moon, Sun, ArrowLeft, Download, FileJson } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTheme } from "../../hooks/useTheme";
import { Link } from "react-router-dom";

export const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b bg-white dark:bg-gray-950 px-4 flex items-center justify-between z-20 relative transition-colors">
      
      {/* Left: Back and Title */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        
        <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">
                CS
            </div>
            {/* Invisible input for title */}
            <Input 
                className="h-8 border-none shadow-none bg-transparent font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-64 px-2" 
                defaultValue="Character Sheet"
            />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2 text-xs">
             <FileJson size={14}/> Guardar
        </Button>
        <Button size="sm" className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
             <Download size={14}/> Exportar PDF
        </Button>
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2"></div>

        <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-full">
          {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
        </Button>
      </div>
    </header>
  );
};