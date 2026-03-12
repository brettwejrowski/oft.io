import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import CommunityPage from "./pages/CommunityPage";
import PostPage from "./pages/PostPage";
import SubmitPage from "./pages/SubmitPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="h-full flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/c/:slug" element={<CommunityPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/submit" element={<SubmitPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
