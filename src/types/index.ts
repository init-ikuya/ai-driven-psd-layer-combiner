export interface LayerInfo {
  id: number;
  name: string;
  groupPath: string[];
  visible: boolean;
  opacity: number;
  left: number;
  top: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement | null;
  imageDataUrl: string | null;
}

export interface PsdData {
  width: number;
  height: number;
  layers: LayerInfo[];
}

export interface AiResponse {
  selectedLayers: number[];
  fileName: string;
  reason?: string;
}

export type ProcessingStatus =
  | 'idle'
  | 'parsing'
  | 'generating-contact-sheet'
  | 'ai-analyzing'
  | 'compositing'
  | 'complete'
  | 'error';
