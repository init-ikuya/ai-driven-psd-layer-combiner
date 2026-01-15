import { Download, Image, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import type { AiResponse } from '../types';
import { ZoomableImage } from './ZoomableImage';

interface ResultPreviewProps {
  canvas: HTMLCanvasElement | null;
  aiResponse: AiResponse | null;
  isProcessing: boolean;
  onDownload: () => void;
}

export function ResultPreview({
  canvas,
  aiResponse,
  isProcessing,
  onDownload,
}: ResultPreviewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <Image size={20} />
        <span>{t.result.title}</span>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50">
        {isProcessing ? (
          <div className="aspect-square flex flex-col items-center justify-center text-gray-400">
            <Loader2 size={48} className="animate-spin" />
            <p className="mt-4">{t.result.compositing}</p>
          </div>
        ) : canvas ? (
          <ZoomableImage
            canvas={canvas}
            className="aspect-square"
            emptyMessage={t.result.placeholder}
          />
        ) : (
          <div className="aspect-square flex flex-col items-center justify-center text-gray-400">
            <Image size={48} />
            <p className="mt-2">{t.result.placeholder}</p>
          </div>
        )}
      </div>

      {aiResponse && (
        <div className="space-y-3">
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              <span className="font-medium">{t.result.suggestedFilename}: </span>
              {aiResponse.fileName}
            </p>
            {aiResponse.reason && (
              <p className="text-sm text-purple-600 mt-1">
                <span className="font-medium">{t.result.reason}: </span>
                {aiResponse.reason}
              </p>
            )}
            <p className="text-xs text-purple-500 mt-2">
              {t.result.selectedLayers}: {aiResponse.selectedLayers.join(', ')}
            </p>
          </div>

          <button
            type="button"
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            {t.result.download} {aiResponse.fileName}
          </button>
        </div>
      )}
    </div>
  );
}
