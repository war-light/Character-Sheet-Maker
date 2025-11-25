import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";
import { Editor } from "./pages/Editor";

// Una Home simple por ahora
const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <h1 className="text-4xl font-bold">RPG Sheet Builder</h1>
    <Link to="/editor/new">
      <Button size="lg">Crear Nueva Hoja</Button>
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* ID optional for now */}
        <Route path="/editor/:sheetId" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
