import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

interface ZoomableImageProps {
  canvas: HTMLCanvasElement | null;
  className?: string;
  emptyMessage?: string;
}

export function ZoomableImage({
  canvas,
  className = '',
  emptyMessage = '画像がありません',
}: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // ドラッグ位置を制限する関数
  const clampPosition = useCallback(
    (x: number, y: number, currentScale: number) => {
      const container = containerRef.current;
      if (!container) return { x, y };

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // スケールに応じたドラッグ可能範囲を計算
      const maxOffset = Math.max(0, (currentScale - 1) * Math.min(containerWidth, containerHeight) * 0.5);

      return {
        x: Math.max(-maxOffset, Math.min(maxOffset, x)),
        y: Math.max(-maxOffset, Math.min(maxOffset, y)),
      };
    },
    [],
  );

  // 高解像度でcanvasを画像化
  useEffect(() => {
    if (canvas) {
      // PNGで出力（ロスレス）
      setImageSrc(canvas.toDataURL('image/png'));
    } else {
      setImageSrc(null);
    }
  }, [canvas]);

  // リセット
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // ズームイン
  const handleZoomIn = useCallback(() => {
    setScale((prev) => {
      const newScale = Math.min(prev * 1.5, MAX_SCALE);
      setPosition((pos) => clampPosition(pos.x, pos.y, newScale));
      return newScale;
    });
  }, [clampPosition]);

  // ズームアウト
  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const newScale = Math.max(prev / 1.5, MIN_SCALE);
      setPosition((pos) => clampPosition(pos.x, pos.y, newScale));
      return newScale;
    });
  }, [clampPosition]);

  // マウスホイールでズーム
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((prev) => {
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * delta));
        setPosition((pos) => clampPosition(pos.x, pos.y, newScale));
        return newScale;
      });
    },
    [clampPosition],
  );

  // ドラッグ開始
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // 左クリックのみ
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position],
  );

  // ドラッグ中
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition(clampPosition(newX, newY, scale));
    },
    [isDragging, dragStart, scale, clampPosition],
  );

  // ドラッグ終了
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ダブルクリックでリセット
  const handleDoubleClick = useCallback(() => {
    handleReset();
  }, [handleReset]);

  // コンテナ外でのマウスアップにも対応
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  if (!canvas || !imageSrc) {
    return (
      <div className={`flex items-center justify-center text-gray-400 text-sm ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 画像表示エリア */}
      <div
        ref={containerRef}
        role="application"
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        style={{
          backgroundImage:
            'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
        }}
      >
        <img
          src={imageSrc}
          alt="Preview"
          draggable={false}
          className="w-full h-full object-contain select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            imageRendering: scale > 2 ? 'pixelated' : 'auto',
          }}
        />
      </div>

      {/* コントロールボタン */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-1">
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="ズームアウト"
        >
          <ZoomOut size={16} className="text-gray-600" />
        </button>
        <span className="text-xs text-gray-500 min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="ズームイン"
        >
          <ZoomIn size={16} className="text-gray-600" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="リセット"
        >
          <RotateCcw size={16} className="text-gray-600" />
        </button>
      </div>

      {/* ヒント */}
      <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white/70 backdrop-blur-sm px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
        ホイール: ズーム / ドラッグ: 移動 / ダブルクリック: リセット
      </div>
    </div>
  );
}
