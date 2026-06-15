import { useNavigate } from "react-router";
import { MapPin, Headphones, Camera, ChevronRight, Clock } from "lucide-react";
import { monuments } from "../data/monuments";
import { useIsMobile } from "../components/ui/use-mobile";

const tagColors: Record<string, { bg: string; text: string }> = {
  Colonial:     { bg: "rgba(78,203,160,0.15)",  text: "#4ECBA0" },
  Religioso:    { bg: "rgba(78,203,160,0.15)",  text: "#4ECBA0" },
  Cultural:     { bg: "rgba(251,191,36,0.15)",  text: "#FBB024" },
  "Século XVII":  { bg: "rgba(167,139,250,0.15)", text: "#A78BFA" },
  "Século XVIII": { bg: "rgba(167,139,250,0.15)", text: "#A78BFA" },
  "Século XIX":   { bg: "rgba(167,139,250,0.15)", text: "#A78BFA" },
};

export default function HomePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0D1117" }}>
      {/* Top bar */}
      <div style={{
        padding: isMobile ? "16px 20px" : "24px 40px 20px",
        borderBottom: "1px solid #1A2030",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "flex-end",
        justifyContent: "space-between",
        gap: isMobile ? 12 : 0,
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ color: "#F9FAFB", fontSize: isMobile ? 22 : 26, fontWeight: 700, margin: 0, marginBottom: 4 }}>
            Monumentos históricos
          </h1>
          <p style={{ color: "#4B5563", fontSize: isMobile ? 13 : 14, margin: 0 }}>
            {monuments.length} patrimônios do centro histórico de São Luís
          </p>
        </div>
        <button
          onClick={() => navigate("/camera")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#4ECBA0", color: "#0D1117",
            padding: "10px 20px", borderRadius: 10, border: "none",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 0 20px rgba(78,203,160,0.3)",
          }}
        >
          <Camera size={16} />
          Escanear monumento
        </button>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: isMobile ? "20px 20px 32px" : "32px 40px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 20,
        alignContent: "start",
      }}>
        {monuments.map((m) => (
          <button
            key={m.id}
            onClick={() => navigate(`/monumento/${m.id}`)}
            style={{
              width: "100%",
              background: "#111827",
              border: "1px solid #1F2937",
              borderRadius: 16,
              overflow: "hidden",
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 0.15s, transform 0.15s",
              display: "flex", flexDirection: "column",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(78,203,160,0.35)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1F2937";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {/* Card illustration area */}
            <div style={{
              height: 160,
              background: "linear-gradient(135deg, #131E2A 0%, #0A1520 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}>
              <MonumentSVG type={m.imagem} size="lg" />
              <div style={{
                position: "absolute", top: 12, right: 12,
                background: "rgba(0,0,0,0.5)", borderRadius: 6,
                padding: "4px 8px",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <Clock size={10} color="#4ECBA0" />
                <span style={{ color: "#4ECBA0", fontSize: 11, fontWeight: 600 }}>{m.duracao || "—"}</span>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {m.tags.map(tag => {
                  const c = tagColors[tag] || { bg: "#1F2937", text: "#9CA3AF" };
                  return (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 700,
                      padding: "3px 8px", borderRadius: 5,
                      background: c.bg, color: c.text,
                      letterSpacing: 0.3,
                    }}>{tag}</span>
                  );
                })}
              </div>

              <h2 style={{ color: "#F9FAFB", fontSize: 17, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>
                {m.nome}
              </h2>

              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <MapPin size={11} color="#4B5563" />
                <span style={{ color: "#4B5563", fontSize: 12 }}>{m.localizacao}</span>
              </div>

              <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
                {m.descricao.slice(0, 100)}…
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Headphones size={13} color="#4ECBA0" />
                  <span style={{ color: "#4ECBA0", fontSize: 12, fontWeight: 600 }}>Narração disponível</span>
                </div>
                <ChevronRight size={16} color="#374151" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MonumentSVG({ type, size = "md" }: { type: string; size?: "sm" | "md" | "lg" }) {
  const scale = size === "lg" ? 1.4 : size === "sm" ? 0.7 : 1;

  if (type === "palacio") return (
    <svg width={120 * scale} height={100 * scale} viewBox="0 0 120 100" fill="none">
      <rect x="10" y="45" width="100" height="50" rx="2" fill="#1F2937" opacity="0.9" />
      <rect x="25" y="25" width="70" height="24" fill="#1F2937" opacity="0.9" />
      <polygon points="60,5 25,25 95,25" fill="#374151" opacity="0.85" />
      <rect x="18" y="62" width="22" height="33" rx="2" fill="#111827" />
      <rect x="80" y="62" width="22" height="33" rx="2" fill="#111827" />
      <rect x="49" y="66" width="22" height="29" rx="1" fill="#111827" />
      <rect x="5" y="92" width="110" height="7" rx="2" fill="#374151" />
    </svg>
  );

  if (type === "catedral") return (
    <svg width={90 * scale} height={120 * scale} viewBox="0 0 90 120" fill="none">
      <rect x="5" y="55" width="80" height="60" rx="2" fill="#1F2937" opacity="0.9" />
      <polygon points="45,5 5,55 85,55" fill="#374151" opacity="0.85" />
      <rect x="12" y="68" width="18" height="47" rx="2" fill="#111827" />
      <rect x="60" y="68" width="18" height="47" rx="2" fill="#111827" />
      <rect x="32" y="74" width="26" height="41" rx="2" fill="#111827" />
      <line x1="45" y1="64" x2="45" y2="72" stroke="#4ECBA0" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="41" y1="68" x2="49" y2="68" stroke="#4ECBA0" strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  );

  if (type === "teatro") return (
    <svg width={130 * scale} height={90 * scale} viewBox="0 0 130 90" fill="none">
      <rect x="5" y="38" width="120" height="50" rx="3" fill="#1F2937" opacity="0.9" />
      <polygon points="65,5 5,38 125,38" fill="#374151" opacity="0.85" />
      <rect x="14" y="52" width="28" height="36" rx="2" fill="#111827" />
      <rect x="88" y="52" width="28" height="36" rx="2" fill="#111827" />
      <rect x="48" y="56" width="34" height="32" rx="2" fill="#111827" />
      <circle cx="65" cy="24" r="5" fill="#4ECBA0" opacity="0.25" />
    </svg>
  );

  if (type === "fonte") return (
    <svg width={100 * scale} height={110 * scale} viewBox="0 0 100 110" fill="none">
      <rect x="25" y="60" width="50" height="40" rx="3" fill="#1F2937" opacity="0.9" />
      <rect x="10" y="98" width="80" height="10" rx="2" fill="#374151" opacity="0.85" />
      <ellipse cx="50" cy="56" rx="35" ry="10" fill="#111827" stroke="#4ECBA0" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="50" cy="28" r="22" fill="#374151" opacity="0.85" />
      <circle cx="50" cy="28" r="11" fill="#1F2937" />
    </svg>
  );

  // obelisco (default)
  return (
    <svg width={65 * scale} height={100 * scale} viewBox="0 0 65 100" fill="none">
      <polygon points="32,5 24,80 41,80" fill="#1F2937" opacity="0.9" />
      <rect x="19" y="80" width="27" height="9" rx="2" fill="#1F2937" opacity="0.9" />
      <rect x="13" y="89" width="39" height="7" rx="2" fill="#1F2937" opacity="0.9" />
      <rect x="8" y="96" width="49" height="4" rx="1" fill="#374151" opacity="0.7" />
    </svg>
  );
}
