import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Play, Share2, ChevronRight, Map } from "lucide-react";
import { getMonumentById } from "../data/monuments";
import { MonumentSVG } from "./HomePage";
import { useIsMobile } from "../components/ui/use-mobile";

const tagColors: Record<string, { bg: string; text: string }> = {
  Colonial:     { bg: "rgba(78,203,160,0.15)",  text: "#4ECBA0" },
  Religioso:    { bg: "rgba(78,203,160,0.15)",  text: "#4ECBA0" },
  Cultural:     { bg: "rgba(251,191,36,0.15)",  text: "#FBB024" },
  "Século XVII":  { bg: "rgba(167,139,250,0.15)", text: "#A78BFA" },
  "Século XVIII": { bg: "rgba(167,139,250,0.15)", text: "#A78BFA" },
  "Século XIX":   { bg: "rgba(167,139,250,0.15)", text: "#A78BFA" },
};

function Waveform() {
  const bars = [3,6,10,7,4,8,12,9,5,7,11,8,4,6,9,7,5,8,10,6,8,5,9,11,7];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 3, height: h * 1.5, borderRadius: 2,
          background: i < 10 ? "#4ECBA0" : "#1F2937",
          transition: "height 0.3s",
        }} />
      ))}
    </div>
  );
}

export default function MonumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const monument = id ? getMonumentById(id) : null;

  if (!monument) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1117", flexDirection: "column", gap: 16 }}>
        <p style={{ color: "#6B7280", fontSize: 16 }}>Monumento não encontrado.</p>
        <button onClick={() => navigate("/")} style={{ background: "#4ECBA0", color: "#0D1117", padding: "10px 20px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Voltar à lista
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0D1117", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{
        padding: isMobile ? "16px 20px" : "20px 40px",
        borderBottom: "1px solid #1A2030",
        display: "flex", alignItems: "center", gap: 16,
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#1F2937", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <ArrowLeft size={17} color="#9CA3AF" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 7 }}>
            {monument.tags.map(tag => {
              const c = tagColors[tag] || { bg: "#1F2937", text: "#9CA3AF" };
              return (
                <span key={tag} style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: c.bg, color: c.text }}>
                  {tag}
                </span>
              );
            })}
          </div>
          <h1 style={{ color: "#F9FAFB", fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: "6px 0 0" }}>
            {monument.nome}
          </h1>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#1F2937", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <Share2 size={16} color="#6B7280" />
        </button>
      </div>

      {/* Body: 2-column layout */}
      <div style={{
        flex: 1,
        overflowY: isMobile ? "auto" : "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}>
        {/* Left: illustration */}
        <div style={{
          width: isMobile ? "100%" : 380,
          flexShrink: 0,
          background: "linear-gradient(160deg, #0D1B2A 0%, #0A1520 100%)",
          borderRight: isMobile ? "none" : "1px solid #1A2030",
          borderBottom: isMobile ? "1px solid #1A2030" : "none",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: isMobile ? 24 : 32,
          padding: isMobile ? "32px 20px" : "40px",
        }}>
          <MonumentSVG type={monument.imagem} size={isMobile ? "md" : "lg"} />

          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
              <MapPin size={13} color="#4B5563" />
              <span style={{ color: "#4B5563", fontSize: 13 }}>{monument.localizacao}</span>
            </div>
            <button
              onClick={() => navigate("/mapa")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(78,203,160,0.08)",
                border: "1px solid rgba(78,203,160,0.2)",
                color: "#4ECBA0", padding: "8px 16px", borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              <Map size={14} />
              Ver no mapa
            </button>
          </div>

          {/* Audio teaser */}
          <div
            onClick={() => navigate(`/audio/${monument.id}`)}
            style={{
              width: "100%",
              background: "#1a2e28",
              border: "1px solid #2D6B55",
              borderRadius: 12, padding: "14px 18px",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14,
            }}
          >
            <button style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "#4ECBA0", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, cursor: "pointer",
              boxShadow: "0 0 16px rgba(78,203,160,0.4)",
            }}>
              <Play size={15} color="#0D1117" fill="#0D1117" />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#4ECBA0", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Ouvir narração guiada
              </div>
              <Waveform />
            </div>
            <div>
              <span style={{ color: "#6B7280", fontSize: 12 }}>{monument.duracao || "—"}</span>
              <ChevronRight size={15} color="#2D6B55" style={{ display: "block", marginTop: 2 }} />
            </div>
          </div>
        </div>

        {/* Right: content */}
        <div style={{
          flex: 1,
          overflowY: isMobile ? "visible" : "auto",
          padding: isMobile ? "32px 20px 48px" : "40px 48px",
        }}>
          {/* Descrição */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ color: "#F9FAFB", fontSize: 16, fontWeight: 700, margin: "0 0 12px", letterSpacing: 0.3 }}>
              Sobre o monumento
            </h2>
            <p style={{ color: "#9CA3AF", fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              {monument.descricao}
            </p>
          </section>

          {/* História */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ color: "#F9FAFB", fontSize: 16, fontWeight: 700, margin: "0 0 12px", letterSpacing: 0.3 }}>
              História
            </h2>
            <p style={{ color: "#9CA3AF", fontSize: 15, lineHeight: 1.75, margin: 0 }}>
              {monument.historia}
            </p>
          </section>

          {/* Curiosidade */}
          <section style={{ marginBottom: 36 }}>
            <div style={{
              background: "rgba(78,203,160,0.06)",
              border: "1px solid rgba(78,203,160,0.2)",
              borderLeft: "3px solid #4ECBA0",
              borderRadius: "0 10px 10px 0",
              padding: "16px 20px",
            }}>
              <p style={{ color: "#4ECBA0", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                Você sabia?
              </p>
              <p style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {monument.curiosidade}
              </p>
            </div>
          </section>

          {/* Capítulos de áudio */}
          {monument.capitulos && monument.capitulos.length > 0 && (
            <section>
              <h2 style={{ color: "#F9FAFB", fontSize: 16, fontWeight: 700, margin: "0 0 14px", letterSpacing: 0.3 }}>
                Capítulos da narração
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {monument.capitulos.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => navigate(`/audio/${monument.id}`)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 16px", borderRadius: 10,
                      background: "#111827", border: "1px solid #1F2937",
                      cursor: "pointer", textAlign: "left",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(78,203,160,0.3)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#1F2937")}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#1F2937",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ color: "#4B5563", fontSize: 11, fontWeight: 700 }}>{ch.id}</span>
                    </div>
                    <span style={{ flex: 1, color: "#D1D5DB", fontSize: 14 }}>{ch.title}</span>
                    <span style={{ color: "#4B5563", fontSize: 12 }}>{ch.time}</span>
                    <ChevronRight size={14} color="#374151" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
