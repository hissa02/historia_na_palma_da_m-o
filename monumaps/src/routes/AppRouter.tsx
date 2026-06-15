import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router";
import { Camera, Map, List, Headphones } from "lucide-react";
import HomePage from "../pages/HomePage";
import CameraPage from "../pages/CameraPage";
import MonumentDetailPage from "../pages/MonumentDetailPage";
import AudioPlayerPage from "../pages/AudioPlayerPage";
import MapPage from "../pages/MapPage";
import { useIsMobile } from "../components/ui/use-mobile";

const NAV = [
  { to: "/", icon: List, label: "Monumentos", exact: true },
  { to: "/mapa", icon: Map, label: "Mapa" },
  { to: "/camera", icon: Camera, label: "Escanear" },
];

function Sidebar() {
  const loc = useLocation();
  const isAudio = loc.pathname.startsWith("/audio");
  const isDetail = loc.pathname.startsWith("/monumento");

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: "#080C12",
      borderRight: "1px solid #1A2030",
      display: "flex", flexDirection: "column",
      padding: "0",
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1A2030" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#4ECBA0",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#0D1117", fontWeight: 900, fontSize: 15 }}>M</span>
          </div>
          <div>
            <div style={{ color: "#4ECBA0", fontSize: 17, fontWeight: 800, letterSpacing: 1.5, lineHeight: 1 }}>
              Monumaps
            </div>
            <div style={{ color: "#3D5040", fontSize: 10, letterSpacing: 1.5, marginTop: 3 }}>
              SÃO LUÍS · MA
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ color: "#3D5040", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "0 12px", marginBottom: 8, textTransform: "uppercase" }}>
          Navegar
        </div>
        {NAV.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10, marginBottom: 2,
              textDecoration: "none",
              background: isActive ? "rgba(78,203,160,0.1)" : "transparent",
              color: isActive ? "#4ECBA0" : "#6B7280",
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              transition: "all 0.15s",
              border: isActive ? "1px solid rgba(78,203,160,0.2)" : "1px solid transparent",
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {/* Context links that appear when on detail/audio pages */}
        {(isDetail || isAudio) && (
          <div style={{ marginTop: 24 }}>
            <div style={{ color: "#3D5040", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "0 12px", marginBottom: 8, textTransform: "uppercase" }}>
              Atual
            </div>
            <div style={{
              padding: "10px 12px", borderRadius: 10,
              background: "rgba(78,203,160,0.06)",
              border: "1px solid rgba(78,203,160,0.15)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Headphones size={15} color="#4ECBA0" />
              <span style={{ color: "#9CA3AF", fontSize: 13 }}>
                {isAudio ? "Narração" : "Detalhes"}
              </span>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #1A2030" }}>
        <div style={{ color: "#2D3A2D", fontSize: 11, lineHeight: 1.5 }}>
          Patrimônio histórico<br />e cultural do Maranhão
        </div>
      </div>
    </aside>
  );
}

function BottomNavbar() {
  return (
    <nav style={{
      height: 64,
      background: "#080C12",
      borderTop: "1px solid #1A2030",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0 12px",
      flexShrink: 0,
      zIndex: 100,
    }}>
      {NAV.map(({ to, icon: Icon, label, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            textDecoration: "none",
            color: isActive ? "#4ECBA0" : "#6B7280",
            fontSize: 11,
            fontWeight: isActive ? 600 : 400,
            flex: 1,
            height: "100%",
            transition: "all 0.15s",
          })}
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppRouter() {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100dvh",
        background: "#0D1117",
        overflow: "hidden"
      }}>
        {!isMobile && <Sidebar />}
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/monumento/:id" element={<MonumentDetailPage />} />
            <Route path="/audio/:id" element={<AudioPlayerPage />} />
          </Routes>
        </main>
        {isMobile && <BottomNavbar />}
      </div>
    </BrowserRouter>
  );
}
