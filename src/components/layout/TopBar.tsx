import {
  ArrowLeft,
  ChevronDown,
  Download,
  FileImage,
  FileJson,
  FileText,
  Moon,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { downloadAsImage, downloadAsPDF } from "../../lib/exportUtils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

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
            className="h-8 border-none shadow-none bg-transparent font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition-colors w-64 px-2"
            defaultValue="Character Sheet"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white data-[state=open]:bg-indigo-700"
            >
              <Download size={14} />
              Export
              <ChevronDown size={12} className="opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 dark:text-white">
            <DropdownMenuItem onClick={downloadAsImage} className="cursor-pointer gap-2 text-xs">
              <FileImage size={14} />
              <span>Download PNG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadAsPDF} className="cursor-pointer gap-2 text-xs">
              <FileText size={14} />
              <span>Download PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2"></div>

        <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-full">
          {theme === "dark" ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-gray-600" />
          )}
        </Button>
      </div>
    </header>
  );
};
