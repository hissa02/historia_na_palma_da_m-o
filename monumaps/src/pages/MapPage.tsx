import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, X, Headphones, ChevronRight } from "lucide-react";
import { monuments } from "../data/monuments";
import type { Monument } from "../types/Monument";
import { useIsMobile } from "../components/ui/use-mobile";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selected, setSelected] = useState<Monument | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    // Dynamically import leaflet
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [-2.5295, -44.3022],
        zoom: 15,
        zoomControl: false,
      });

      // Dark tile layer from CartoDB
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom green marker icon
      const greenIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:36px;height:36px;
          background:#4ECBA0;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid #0D1117;
          box-shadow:0 4px 14px rgba(78,203,160,0.5);
          display:flex;align-items:center;justify-content:center;
        "><div style="
          transform:rotate(45deg);
          width:14px;height:14px;
          background:#0D1117;
          border-radius:50%;
        "></div></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
      });

      // Add markers
      monuments.forEach((m) => {
        if (!m.coordenadas) return;
        const marker = L.marker([m.coordenadas.lat, m.coordenadas.lng], { icon: greenIcon })
          .addTo(map);

        marker.on("click", () => {
          setSelected(m);
          map.panTo([m.coordenadas!.lat, m.coordenadas!.lng], { animate: true });
        });

        // Tooltip label
        marker.bindTooltip(m.nome, {
          permanent: false,
          direction: "top",
          offset: [0, -40],
          className: "monumaps-tooltip",
        });
      });

      // Zoom controls (custom position)
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0D1117" }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? "16px 20px" : "24px 40px 20px",
        borderBottom: "1px solid #1A2030",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "flex-end",
        justifyContent: "space-between",
        gap: isMobile ? 10 : 0,
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ color: "#F9FAFB", fontSize: isMobile ? 22 : 26, fontWeight: 700, margin: 0, marginBottom: 4 }}>
            Mapa de monumentos
          </h1>
          <p style={{ color: "#4B5563", fontSize: isMobile ? 12 : 14, margin: 0 }}>
            Centro histórico de São Luís — Patrimônio Mundial UNESCO
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#4ECBA0", boxShadow: "0 0 8px rgba(78,203,160,0.6)"
          }} />
          <span style={{ color: "#4ECBA0", fontSize: 13, fontWeight: 600 }}>
            {monuments.filter(m => m.coordenadas).length} locais mapeados
          </span>
        </div>
      </div>

      {/* Map container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {/* Selected monument panel */}
        {selected && (
          <div style={{
            position: "absolute", bottom: isMobile ? 16 : 24, left: "50%",
            transform: "translateX(-50%)",
            width: "min(480px, calc(100% - 32px))",
            background: "#111827",
            border: "1px solid rgba(78,203,160,0.25)",
            borderRadius: 16,
            padding: isMobile ? "16px 18px" : "20px 22px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex", gap: isMobile ? 12 : 18, alignItems: "center",
          }}>
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute", top: 12, right: 12,
                width: 28, height: 28, borderRadius: "50%",
                background: "#1F2937", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={14} color="#6B7280" />
            </button>

            <div style={{
              width: isMobile ? 60 : 72, height: isMobile ? 60 : 72, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg, #131E2A 0%, #0A1520 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MonumentSVGSmall type={selected.imagem} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                {selected.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "2px 7px", borderRadius: 4,
                    background: "rgba(78,203,160,0.15)", color: "#4ECBA0",
                  }}>{tag}</span>
                ))}
              </div>
              <h3 style={{ color: "#F9FAFB", fontSize: isMobile ? 15 : 17, fontWeight: 700, margin: "0 0 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selected.nome}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <MapPin size={11} color="#4B5563" />
                <span style={{ color: "#4B5563", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selected.localizacao}</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => navigate(`/monumento/${selected.id}`)}
                  style={{
                    flex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: "#4ECBA0", color: "#0D1117",
                    padding: "9px 12px", borderRadius: 9, border: "none",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Ver detalhes <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => navigate(`/audio/${selected.id}`)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#1F2937", color: "#9CA3AF",
                    padding: "9px 12px", borderRadius: 9, border: "none",
                    fontSize: 12, cursor: "pointer",
                  }}
                >
                  <Headphones size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        {!isMobile && (
          <div style={{
            position: "absolute", top: 16, left: 16,
            background: "rgba(13,17,23,0.9)",
            border: "1px solid #1A2030",
            borderRadius: 10, padding: "10px 14px",
            zIndex: 900,
          }}>
            <p style={{ color: "#6B7280", fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", margin: "0 0 8px" }}>
              Monumentos
            </p>
            {monuments.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setSelected(m);
                  if (m.coordenadas && mapInstanceRef.current) {
                    mapInstanceRef.current.panTo([m.coordenadas.lat, m.coordenadas.lng], { animate: true });
                  }
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", padding: "5px 0",
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: selected?.id === m.id ? "#4ECBA0" : "#374151",
                  flexShrink: 0,
                  boxShadow: selected?.id === m.id ? "0 0 6px rgba(78,203,160,0.6)" : "none",
                }} />
                <span style={{
                  color: selected?.id === m.id ? "#4ECBA0" : "#6B7280",
                  fontSize: 12,
                  fontWeight: selected?.id === m.id ? 600 : 400,
                }}>{m.nome}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leaflet tooltip styles injected globally */}
      <style>{`
        .leaflet-container { background: #111827 !important; }
        .monumaps-tooltip {
          background: #0D1117 !important;
          border: 1px solid rgba(78,203,160,0.35) !important;
          color: #4ECBA0 !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 5px 10px !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5) !important;
        }
        .monumaps-tooltip::before { display: none !important; }
        .leaflet-control-attribution { display: none; }
        .leaflet-control-zoom a {
          background: #111827 !important;
          color: #9CA3AF !important;
          border-color: #1F2937 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1F2937 !important;
          color: #4ECBA0 !important;
        }
      `}</style>
    </div>
  );
}

function MonumentSVGSmall({ type }: { type: string }) {
  if (type === "palacio") return (
    <svg width="44" height="36" viewBox="0 0 120 100" fill="none">
      <rect x="10" y="45" width="100" height="50" rx="2" fill="#1F2937" />
      <rect x="25" y="25" width="70" height="24" fill="#1F2937" />
      <polygon points="60,5 25,25 95,25" fill="#374151" />
      <rect x="49" y="62" width="22" height="33" rx="1" fill="#111827" />
    </svg>
  );
  if (type === "catedral") return (
    <svg width="36" height="48" viewBox="0 0 90 120" fill="none">
      <rect x="5" y="55" width="80" height="60" rx="2" fill="#1F2937" />
      <polygon points="45,5 5,55 85,55" fill="#374151" />
      <rect x="32" y="74" width="26" height="41" rx="2" fill="#111827" />
    </svg>
  );
  if (type === "teatro") return (
    <svg width="48" height="33" viewBox="0 0 130 90" fill="none">
      <rect x="5" y="38" width="120" height="50" rx="3" fill="#1F2937" />
      <polygon points="65,5 5,38 125,38" fill="#374151" />
      <rect x="48" y="56" width="34" height="32" rx="2" fill="#111827" />
    </svg>
  );
  if (type === "fonte") return (
    <svg width="40" height="44" viewBox="0 0 100 110" fill="none">
      <rect x="25" y="60" width="50" height="40" rx="3" fill="#1F2937" />
      <ellipse cx="50" cy="56" rx="35" ry="10" fill="#111827" stroke="#4ECBA0" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="50" cy="28" r="22" fill="#374151" />
    </svg>
  );
  return (
    <svg width="26" height="40" viewBox="0 0 65 100" fill="none">
      <polygon points="32,5 24,80 41,80" fill="#1F2937" />
      <rect x="19" y="80" width="27" height="9" rx="2" fill="#1F2937" />
      <rect x="13" y="89" width="39" height="7" rx="2" fill="#1F2937" />
    </svg>
  );
}
