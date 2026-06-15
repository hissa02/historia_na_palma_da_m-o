import { useRef, useState, useCallback, useEffect } from "react";

export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "denied"
  | "unavailable"
  | "error";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      setError("Câmera não disponível neste dispositivo ou navegador.");
      return;
    }

    setStatus("requesting");
    setError(null);

    try {
      // Prioriza câmera traseira em dispositivos móveis
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("active");
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setStatus("denied");
          setError("Permissão para câmera negada. Permita o acesso nas configurações do navegador.");
        } else if (err.name === "NotFoundError") {
          setStatus("unavailable");
          setError("Nenhuma câmera encontrada no dispositivo.");
        } else {
          setStatus("error");
          setError(`Erro ao acessar câmera: ${err.message}`);
        }
      } else {
        setStatus("error");
        setError("Erro desconhecido ao iniciar câmera.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
  }, []);

  const captureFrame = useCallback((): Blob | null => {
    if (!videoRef.current || status !== "active") return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0);

    // Retorna como blob (para uso com recognition service)
    let blob: Blob | null = null;
    canvas.toBlob((b) => { blob = b; }, "image/jpeg", 0.9);
    return blob;
  }, [status]);

  // Limpa stream ao desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return { videoRef, status, error, startCamera, stopCamera, captureFrame };
}
