import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Zap, ScanLine, ArrowLeft, AlertCircle, Loader2, Info } from "lucide-react";
import { useCamera } from "../hooks/useCamera";
import { identificarMonumento } from "../services/recognitionService";
import { monuments } from "../data/monuments";
import { MonumentSVG } from "./HomePage";
import { useIsMobile } from "../components/ui/use-mobile";

type ScanState = "idle" | "scanning" | "found" | "notfound";

export default function CameraPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { videoRef, status, error, startCamera, stopCamera, captureFrame } = useCamera();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [foundId, setFoundId] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  // Manage camera state: stop stream when monument is found, restart on scan another
  useEffect(() => {
    if (scanState !== "found") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scanState]);

  const handleCapture = useCallback(async () => {
    if (status !== "active" || scanState === "scanning") return;
    setScanState("scanning");
    const blob = captureFrame();
    try {
      const result = await identificarMonumento(blob ?? undefined);
      if (result.monumentId && result.confidence > 0.5) {
        setFoundId(result.monumentId);
        setScanState("found");
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
      } else {
        setScanState("notfound");
        setTimeout(() => setScanState("idle"), 2500);
      }
    } catch {
      setScanState("notfound");
      setTimeout(() => setScanState("idle"), 2500);
    }
  }, [status, scanState, captureFrame]);

  const foundMonument = foundId ? monuments.find(m => m.id === foundId) : null;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0D1117" }}>
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
          <h1 style={{ color: "#F9FAFB", fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: 0 }}>
            Escanear monumento
          </h1>
          <p style={{ color: "#4B5563", fontSize: 13, margin: "3px 0 0" }}>
            Aponte a câmera para um monumento histórico
          </p>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#4B5563", fontSize: 12 }}>
            <Info size={14} />
            Requer permissão de câmera
          </div>
        )}
      </div>

      {/* Body: camera + right panel */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        position: "relative"
      }}>

        {/* Flash */}
        {flash && (
          <div style={{
            position: "absolute", inset: 0, background: "white",
            opacity: 0.5, zIndex: 200, pointerEvents: "none",
          }} />
        )}

        {/* Camera viewfinder - Hidden when monument is identified */}
        {scanState !== "found" && (
          <div style={{
            flex: isMobile ? "none" : 1,
            height: isMobile ? "320px" : "100%",
            position: "relative",
            overflow: "hidden",
            background: "#050A0F"
          }}>
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                display: status === "active" ? "block" : "none",
              }}
            />

            {/* Dark fallback */}
            {status !== "active" && (
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at center, #0D1B2A 0%, #050A0F 100%)",
              }} />
            )}

            {/* Status overlays */}
            {status === "requesting" && (
              <CenterOverlay>
                <Loader2 size={36} color="#4ECBA0" style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ color: "#9CA3AF", fontSize: 15 }}>Acessando câmera…</p>
              </CenterOverlay>
            )}
            {(status === "denied" || status === "unavailable" || status === "error") && (
              <CenterOverlay>
                <AlertCircle size={36} color="#F87171" />
                <p style={{ color: "#F87171", fontSize: 15, fontWeight: 600, textAlign: "center" }}>{error}</p>
                <p style={{ color: "#6B7280", fontSize: 13, textAlign: "center", maxWidth: 280 }}>
                  Acesse pelo navegador via HTTPS e permita o uso da câmera nas configurações.
                </p>
              </CenterOverlay>
            )}

            {/* AR scanner overlay */}
            {status === "active" && (
              <>
                {/* Corner brackets */}
                {[
                  { top: "15%", left: "15%", bt: ["top", "left"] },
                  { top: "15%", right: "15%", bt: ["top", "right"] },
                  { bottom: "25%", left: "15%", bt: ["bottom", "left"] },
                  { bottom: "25%", right: "15%", bt: ["bottom", "right"] },
                ].map((c, i) => (
                  <div key={i} style={{ position: "absolute", ...Object.fromEntries(Object.entries(c).filter(([k]) => !['bt'].includes(k))) }}>
                    <div style={{
                      width: 28, height: 28,
                      borderTop: (c.bt as string[]).includes("top") ? "2.5px solid #4ECBA0" : "none",
                      borderBottom: (c.bt as string[]).includes("bottom") ? "2.5px solid #4ECBA0" : "none",
                      borderLeft: (c.bt as string[]).includes("left") ? "2.5px solid #4ECBA0" : "none",
                      borderRight: (c.bt as string[]).includes("right") ? "2.5px solid #4ECBA0" : "none",
                      borderRadius: (c.bt as string[]).includes("top") && (c.bt as string[]).includes("left") ? "4px 0 0 0"
                        : (c.bt as string[]).includes("top") ? "0 4px 0 0"
                          : (c.bt as string[]).includes("left") ? "0 0 0 4px" : "0 0 4px 0",
                      opacity: scanState === "scanning" ? 1 : 0.7,
                      transition: "opacity 0.3s",
                    }} />
                  </div>
                ))}

                {/* Center dot */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#4ECBA0",
                  boxShadow: "0 0 12px #4ECBA0, 0 0 24px rgba(78,203,160,0.4)",
                }} />

                {/* Scan line animation */}
                {scanState === "scanning" && (
                  <div style={{ position: "absolute", top: "15%", left: "15%", right: "15%", bottom: "25%", overflow: "hidden", pointerEvents: "none" }}>
                    <div style={{
                      position: "absolute", left: 0, right: 0, height: 2,
                      background: "linear-gradient(90deg, transparent, #4ECBA0 30%, #4ECBA0 70%, transparent)",
                      animation: "scanLine 1.2s ease-in-out infinite",
                    }} />
                  </div>
                )}

                {/* Status badge */}
                <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)" }}>
                  {scanState === "notfound" && (
                    <Badge color="#F87171" text="Nenhum monumento detectado" />
                  )}
                  {scanState === "scanning" && (
                    <Badge color="#4ECBA0" text="Identificando..." loader />
                  )}
                </div>
              </>
            )}

            {/* Camera controls at bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(0deg, rgba(5,10,15,0.95) 0%, transparent 100%)",
              padding: isMobile ? "12px 0 20px" : "24px 0 32px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 32,
            }}>
              <button style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(31,41,55,0.8)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <ScanLine size={20} color="#6B7280" />
              </button>

              <button
                onClick={handleCapture}
                disabled={status !== "active" || scanState === "scanning"}
                style={{
                  width: isMobile ? 64 : 72, height: isMobile ? 64 : 72, borderRadius: "50%",
                  background: scanState === "scanning" ? "#1F2937" : "#4ECBA0",
                  border: scanState === "scanning" ? "2px solid #374151" : "3px solid rgba(78,203,160,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: status === "active" && scanState !== "scanning" ? "pointer" : "not-allowed",
                  boxShadow: scanState === "scanning" ? "none" : "0 0 28px rgba(78,203,160,0.5)",
                  transition: "all 0.2s",
                }}
              >
                {scanState === "scanning"
                  ? <Loader2 size={24} color="#4ECBA0" style={{ animation: "spin 1s linear infinite" }} />
                  : <div style={{ width: 24, height: 24, borderRadius: "50%", border: "3px solid #0D1117" }} />
                }
              </button>

              <button style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(31,41,55,0.8)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <Zap size={20} color="#6B7280" />
              </button>
            </div>
          </div>
        )}

        {/* Right/Bottom panel: result or instructions */}
        <div style={{
          width: (isMobile || scanState === "found") ? "100%" : 340,
          flexShrink: 0,
          background: "#080C12",
          borderLeft: (isMobile || scanState === "found") ? "none" : "1px solid #1A2030",
          borderTop: (isMobile && scanState !== "found") ? "1px solid #1A2030" : "none",
          display: "flex", flexDirection: "column",
          padding: (isMobile || scanState === "found") ? "24px 20px" : "32px 28px",
          gap: 24,
          overflowY: "auto",
          flex: 1,
        }}>
          {scanState === "found" && foundMonument ? (
            <>
              <div>
                <p style={{ color: "#4ECBA0", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 6px" }}>
                  Identificado
                </p>
                <h2 style={{ color: "#F9FAFB", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
                  {foundMonument.nome}
                </h2>
                <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>{foundMonument.localizacao}</p>
              </div>

              <div style={{
                height: 160, borderRadius: 12,
                background: "linear-gradient(135deg, #131E2A, #0A1520)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid #1F2937",
              }}>
                <MonumentSVG type={foundMonument.imagem} size="md" />
              </div>

              <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {foundMonument.descricao}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => navigate(`/monumento/${foundMonument.id}`)}
                  style={{
                    width: "100%", padding: "12px",
                    background: "#4ECBA0", color: "#0D1117",
                    border: "none", borderRadius: 10,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 0 20px rgba(78,203,160,0.3)",
                  }}
                >
                  Ver detalhes completos →
                </button>
                <button
                  onClick={() => navigate(`/audio/${foundMonument.id}`)}
                  style={{
                    width: "100%", padding: "12px",
                    background: "#1F2937", color: "#9CA3AF",
                    border: "1px solid #374151", borderRadius: 10,
                    fontSize: 14, cursor: "pointer",
                  }}
                >
                  🎧 Ouvir narração
                </button>
                <button
                  onClick={() => { setFoundId(null); setScanState("idle"); }}
                  style={{
                    width: "100%", padding: "10px",
                    background: "none", color: "#4B5563",
                    border: "none", fontSize: 13, cursor: "pointer",
                  }}
                >
                  Escanear outro →
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p style={{ color: "#4B5563", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 8px" }}>
                  Como usar
                </p>
                <h2 style={{ color: "#F9FAFB", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
                  Aponte para um monumento
                </h2>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  Enquadre o monumento na área de scanner e pressione o botão central para identificá-lo.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { n: "1", text: "Aponte a câmera para o monumento" },
                  { n: "2", text: "Enquadre dentro das marcações" },
                  { n: "3", text: "Pressione o botão circular" },
                  { n: "4", text: "Veja informações e ouça a narração" },
                ].map(step => (
                  <div key={step.n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      background: "#1F2937",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: "#4ECBA0", fontSize: 12, fontWeight: 700 }}>{step.n}</span>
                    </div>
                    <p style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.5, margin: 0, paddingTop: 4 }}>{step.text}</p>
                  </div>
                ))}
              </div>

              <div style={{
                background: "rgba(78,203,160,0.05)",
                border: "1px solid rgba(78,203,160,0.15)",
                borderRadius: 10, padding: "14px 16px",
              }}>
                <p style={{ color: "#4ECBA0", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>
                  Modo demonstração ativo
                </p>
                <p style={{ color: "#4B5563", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                  O reconhecimento está em modo mock. Cada captura retornará um monumento diferente para demonstrar o fluxo completo.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanLine { 0% { top: 0 } 50% { top: calc(100% - 2px) } 100% { top: 0 } }
      `}</style>
    </div>
  );
}

function Badge({ color, text, loader }: { color: string; text: string; loader?: boolean }) {
  return (
    <div style={{
      background: `${color}1A`, border: `1px solid ${color}55`,
      borderRadius: 20, padding: "6px 16px",
      display: "flex", alignItems: "center", gap: 8,
      backdropFilter: "blur(8px)",
    }}>
      {loader
        ? <Loader2 size={12} color={color} style={{ animation: "spin 1s linear infinite" }} />
        : <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      }
      <span style={{ color, fontSize: 12, fontWeight: 600 }}>{text}</span>
    </div>
  );
}

function CenterOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16, padding: 40,
    }}>
      {children}
    </div>
  );
}
