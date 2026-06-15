/**
 * recognitionService.ts
 *
 * Camada de reconhecimento de monumentos a partir de imagens capturadas.
 *
 * Arquitetura preparada para integração futura com:
 * - TensorFlow.js (classificação de imagens com modelo customizado)
 * - OpenCV.js (detecção de features e correspondência de descritores)
 * - YOLO via ONNX runtime (detecção de objetos em tempo real)
 *
 * Atualmente utiliza mock baseado em simulação temporal.
 */

export interface RecognitionResult {
  monumentId: string | null;
  confidence: number;
  method: "mock" | "tensorflow" | "opencv" | "yolo";
  processingTimeMs: number;
}

// ─── Mock recognition ──────────────────────────────────────────────────────────

const MOCK_MONUMENTS = [
  "obelisco-memoria",
  "palacio-leoes",
  "catedral-se",
  "teatro-artur-azevedo",
  "fonte-ribeirão",
];

let mockCallCount = 0;

async function mockRecognition(): Promise<RecognitionResult> {
  // Simula tempo de processamento de visão computacional
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

  // Cicla pelos monumentos para demonstração
  const idx = mockCallCount % MOCK_MONUMENTS.length;
  mockCallCount++;

  return {
    monumentId: MOCK_MONUMENTS[idx],
    confidence: 0.72 + Math.random() * 0.25,
    method: "mock",
    processingTimeMs: 1200,
  };
}

// ─── TensorFlow.js stub ────────────────────────────────────────────────────────
// TODO: Implementar com @tensorflow/tfjs e modelo treinado em monumentos de São Luís
//
// async function tensorflowRecognition(imageData: ImageData): Promise<RecognitionResult> {
//   const model = await tf.loadLayersModel('/models/monuments/model.json');
//   const tensor = tf.browser.fromPixels(imageData).resizeBilinear([224, 224]).expandDims(0);
//   const predictions = model.predict(tensor) as tf.Tensor;
//   const [topClass, confidence] = await getTopPrediction(predictions);
//   return { monumentId: CLASS_NAMES[topClass], confidence, method: 'tensorflow', processingTimeMs: 0 };
// }

// ─── OpenCV.js stub ───────────────────────────────────────────────────────────
// TODO: Implementar com opencv.js para feature matching (ORB/SIFT)
//
// async function opencvRecognition(canvas: HTMLCanvasElement): Promise<RecognitionResult> {
//   const src = cv.imread(canvas);
//   const detector = new cv.ORB(500);
//   const keypoints = new cv.KeyPointVector();
//   const descriptors = new cv.Mat();
//   detector.detectAndCompute(src, new cv.Mat(), keypoints, descriptors);
//   // ... match against monument descriptor database
// }

// ─── YOLO stub ────────────────────────────────────────────────────────────────
// TODO: Implementar com onnxruntime-web e modelo YOLO exportado para ONNX
//
// async function yoloRecognition(imageBlob: Blob): Promise<RecognitionResult> {
//   const session = await ort.InferenceSession.create('/models/yolo-monuments.onnx');
//   const inputTensor = await preprocessImage(imageBlob);
//   const results = await session.run({ images: inputTensor });
//   // ... parse bounding boxes and class predictions
// }

// ─── Public API ───────────────────────────────────────────────────────────────

type RecognitionEngine = "mock" | "tensorflow" | "opencv" | "yolo";

let currentEngine: RecognitionEngine = "mock";

export function setRecognitionEngine(engine: RecognitionEngine) {
  currentEngine = engine;
}

export async function identificarMonumento(
  _imageBlob?: Blob
): Promise<RecognitionResult> {
  const start = performance.now();

  switch (currentEngine) {
    case "mock":
    default:
      return mockRecognition();

    // Descomente quando integrar engines reais:
    // case "tensorflow":
    //   return tensorflowRecognition(imageData);
    // case "opencv":
    //   return opencvRecognition(canvas);
    // case "yolo":
    //   return yoloRecognition(_imageBlob!);
  }
}
