import type { Layer } from 'ag-psd';
import { readPsd } from 'ag-psd';
import type { LayerInfo, PsdData } from '../types';

function flattenLayers(
  layer: Layer,
  groupPath: string[] = [],
  result: LayerInfo[] = [],
  idCounter: { value: number } = { value: 0 },
): LayerInfo[] {
  if (layer.children) {
    const currentPath = layer.name ? [...groupPath, layer.name] : groupPath;
    for (const child of layer.children) {
      flattenLayers(child, currentPath, result, idCounter);
    }
  } else if (layer.canvas) {
    const canvas = layer.canvas as HTMLCanvasElement;
    result.push({
      id: idCounter.value++,
      name: layer.name || `Layer ${idCounter.value}`,
      groupPath,
      visible: layer.hidden !== true,
      opacity: layer.opacity ?? 1,
      left: layer.left ?? 0,
      top: layer.top ?? 0,
      width: canvas.width,
      height: canvas.height,
      canvas,
      imageDataUrl: canvas.toDataURL('image/png'),
    });
  }
  return result;
}

export async function parsePsdFile(file: File): Promise<PsdData> {
  const arrayBuffer = await file.arrayBuffer();
  const psd = readPsd(arrayBuffer);

  const layers = flattenLayers(psd);

  return {
    width: psd.width,
    height: psd.height,
    layers,
  };
}

export function generateContactSheet(
  layers: LayerInfo[],
  options: {
    columns?: number;
    cellSize?: number;
    padding?: number;
  } = {},
): HTMLCanvasElement {
  const { columns = 4, cellSize = 150, padding = 10 } = options;

  const rows = Math.ceil(layers.length / columns);
  const canvasWidth = columns * (cellSize + padding) + padding;
  const canvasHeight = rows * (cellSize + padding) + padding + 30 * rows;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  layers.forEach((layer, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = col * (cellSize + padding) + padding;
    const y = row * (cellSize + padding + 30) + padding;

    ctx.fillStyle = '#16213e';
    ctx.fillRect(x, y, cellSize, cellSize);

    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cellSize, cellSize);

    if (layer.canvas) {
      const scale = Math.min((cellSize - 10) / layer.width, (cellSize - 10) / layer.height);
      const drawWidth = layer.width * scale;
      const drawHeight = layer.height * scale;
      const drawX = x + (cellSize - drawWidth) / 2;
      const drawY = y + (cellSize - drawHeight) / 2;

      ctx.drawImage(layer.canvas, drawX, drawY, drawWidth, drawHeight);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText(`#${layer.id}`, x + 5, y + cellSize + 20);

    ctx.font = '11px system-ui';
    const truncatedName = layer.name.length > 15 ? `${layer.name.slice(0, 12)}...` : layer.name;
    ctx.fillText(truncatedName, x + 35, y + cellSize + 20);
  });

  return canvas;
}

export function compositeLayers(
  layers: LayerInfo[],
  selectedIds: number[],
  canvasWidth: number,
  canvasHeight: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const sortedIds = [...selectedIds].sort((a, b) => a - b);

  for (const id of sortedIds) {
    const layer = layers.find((l) => l.id === id);
    if (layer?.canvas) {
      ctx.globalAlpha = layer.opacity;
      ctx.drawImage(layer.canvas, layer.left, layer.top);
    }
  }

  ctx.globalAlpha = 1;
  return canvas;
}
