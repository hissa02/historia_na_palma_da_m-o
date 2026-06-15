import { useParams, useNavigate } from "react-router";
import { ArrowLeft, SkipBack, SkipForward, Pause, Play, RotateCcw, ChevronRight, Music2 } from "lucide-react";
import { getMonumentById } from "../data/monuments";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { MonumentSVG } from "./HomePage";
import { useIsMobile } from "../components/ui/use-mobile";

export default function AudioPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const monument = id ? getMonumentById(id) : null;
  const { playing, currentTime, duration, speed, togglePlay, seekTo, cycleSpeed, formatTime } =
    useAudioPlayer(monument?.audioUrl);

  if (!monument) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1117" }}>
        <p style={{ color: "#6B7280" }}>Áudio não encontrado.</p>
      </div>
    );
  }

  const totalSeconds = duration || 165;
  const progressPercent = totalSeconds > 0 ? Math.min(100, (currentTime / totalSeconds) * 100) : 0;
  const chapters = monument.capitulos || [];

  const activeChapterIdx = chapters.reduce((acc, ch, i) => {
    if (currentTime >= ch.startSeconds) return i;
    return acc;
  }, 0);

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
          <p style={{ color: "#4B5563", fontSize: 12, margin: "0 0 3px" }}>Narração guiada</p>
          <h1 style={{ color: "#F9FAFB", fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: 0 }}>{monument.nome}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1F2937", padding: isMobile ? "6px 12px" : "7px 14px", borderRadius: 8 }}>
          <Music2 size={14} color="#4ECBA0" />
          <span style={{ color: "#4ECBA0", fontSize: 13, fontWeight: 600 }}>Áudio guia</span>
        </div>
      </div>

      {/* Body: player left + chapters right */}
      <div style={{
        flex: 1,
        overflowY: isMobile ? "auto" : "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}>

        {/* Left: big player */}
        <div style={{
          width: isMobile ? "100%" : 420,
          flexShrink: 0,
          background: "linear-gradient(160deg, #0D1B2A 0%, #080D14 100%)",
          borderRight: isMobile ? "none" : "1px solid #1A2030",
          borderBottom: isMobile ? "1px solid #1A2030" : "none",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: isMobile ? "32px 20px" : "40px 48px",
          gap: isMobile ? 24 : 32,
        }}>
          {/* Album art */}
          <div style={{
            width: isMobile ? 140 : 180,
            height: isMobile ? 140 : 180,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #111E2A 0%, #080E18 100%)",
            border: "2px solid #1A2030",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: playing
              ? "0 0 60px rgba(78,203,160,0.2), 0 0 120px rgba(78,203,160,0.08)"
              : "0 0 20px rgba(0,0,0,0.5)",
            transition: "box-shadow 0.5s ease",
          }}>
            <MonumentSVG type={monument.imagem} size={isMobile ? "sm" : "md"} />
          </div>

          {/* Track info */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <h2 style={{ color: "#F9FAFB", fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>
              {monument.nome}
            </h2>
            <p style={{ color: "#4ECBA0", fontSize: 13, margin: 0 }}>
              {chapters[activeChapterIdx]?.title || "Narração guiada"}
            </p>
          </div>

          {/* Progress */}
          <div style={{ width: "100%" }}>
            <div
              style={{ height: 4, background: "#1A2030", borderRadius: 3, marginBottom: 8, position: "relative", cursor: "pointer" }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                seekTo(((e.clientX - rect.left) / rect.width) * totalSeconds);
              }}
            >
              <div style={{
                width: `${progressPercent}%`, height: "100%",
                background: "linear-gradient(90deg, #2D9B76, #4ECBA0)",
                borderRadius: 3, transition: "width 0.25s linear",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: `${progressPercent}%`,
                transform: "translate(-50%, -50%)",
                width: 14, height: 14, borderRadius: "50%",
                background: "#4ECBA0", boxShadow: "0 0 10px rgba(78,203,160,0.7)",
                transition: "left 0.25s linear",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#4B5563", fontSize: 12 }}>{formatTime(currentTime)}</span>
              <span style={{ color: "#4B5563", fontSize: 12 }}>{monument.duracao || formatTime(totalSeconds)}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, marginBottom: 8 }}>
            <button onClick={() => seekTo(Math.max(0, currentTime - 15))} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", alignItems: "center", gap: 4 }}>
              <RotateCcw size={18} color="#4B5563" />
              <span style={{ color: "#4B5563", fontSize: 10, fontWeight: 600 }}>15</span>
            </button>

            <button
              onClick={() => seekTo(Math.max(0, currentTime - 30))}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#1F2937", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
            >
              <SkipBack size={18} color="#9CA3AF" />
            </button>

            <button
              onClick={togglePlay}
              style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "#FFFFFF", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(255,255,255,0.15)",
              }}
            >
              {playing
                ? <Pause size={24} color="#0D1117" fill="#0D1117" />
                : <Play size={24} color="#0D1117" fill="#0D1117" style={{ marginLeft: 3 }} />
              }
            </button>

            <button
              onClick={() => seekTo(Math.min(totalSeconds, currentTime + 30))}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#1F2937", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
            >
              <SkipForward size={18} color="#9CA3AF" />
            </button>

            <button
              onClick={cycleSpeed}
              style={{
                background: "rgba(78,203,160,0.1)",
                border: "1px solid rgba(78,203,160,0.25)",
                borderRadius: 8, padding: "7px 12px", cursor: "pointer",
              }}
            >
              <span style={{ color: "#4ECBA0", fontSize: 13, fontWeight: 700 }}>{speed}×</span>
            </button>
          </div>

          {/* Link back to details */}
          <button
            onClick={() => navigate(`/monumento/${monument.id}`)}
            style={{
              width: "100%",
              background: "rgba(78,203,160,0.08)",
              border: "1px solid rgba(78,203,160,0.25)",
              borderRadius: 12,
              padding: "12px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#4ECBA0",
              fontSize: 13,
              fontWeight: 600,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(78,203,160,0.15)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(78,203,160,0.08)")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              📖 Ver detalhes completos
            </span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Right: chapters list */}
        <div style={{
          flex: 1,
          overflowY: isMobile ? "visible" : "auto",
          padding: isMobile ? "32px 20px 48px" : "40px 48px",
        }}>
          <h2 style={{ color: "#F9FAFB", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
            Capítulos
          </h2>
          <p style={{ color: "#4B5563", fontSize: 13, margin: "0 0 28px" }}>
            Clique para ir direto a um trecho da narração
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {chapters.map((ch, i) => {
              const isActive = i === activeChapterIdx;
              return (
                <button
                  key={ch.id}
                  onClick={() => seekTo(ch.startSeconds)}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "16px 20px", borderRadius: 12,
                    background: isActive ? "rgba(78,203,160,0.08)" : "#111827",
                    border: isActive ? "1px solid rgba(78,203,160,0.3)" : "1px solid #1F2937",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = "rgba(78,203,160,0.2)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = "#1F2937"; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? "rgba(78,203,160,0.15)" : "#1F2937",
                    border: isActive ? "1.5px solid rgba(78,203,160,0.4)" : "1.5px solid transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isActive && playing
                      ? <WavePulse />
                      : <span style={{ color: isActive ? "#4ECBA0" : "#4B5563", fontSize: 13, fontWeight: 700 }}>{ch.id}</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: isActive ? "#4ECBA0" : "#D1D5DB", fontSize: 15, fontWeight: isActive ? 600 : 400, margin: "0 0 3px" }}>
                      {ch.title}
                    </p>
                    <p style={{ color: "#4B5563", fontSize: 12, margin: 0 }}>Começa em {ch.time}</p>
                  </div>
                  {isActive && (
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "#4ECBA0",
                      background: "rgba(78,203,160,0.1)", padding: "3px 9px", borderRadius: 5,
                    }}>
                      AGORA
                    </div>
                  )}
                  <ChevronRight size={16} color={isActive ? "#4ECBA0" : "#374151"} />
                </button>
              );
            })}
          </div>

          {/* Transcription teaser */}
          <div style={{
            marginTop: 36,
            background: "#111827", border: "1px solid #1F2937",
            borderRadius: 12, padding: "20px 24px",
          }}>
            <p style={{ color: "#6B7280", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>
              Sobre esta narração
            </p>
            <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {monument.descricao}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WavePulse() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[4, 8, 5].map((h, i) => (
        <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: "#4ECBA0" }} />
      ))}
    </div>
  );
}
