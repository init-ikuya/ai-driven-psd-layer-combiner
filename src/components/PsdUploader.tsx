import { AlertCircle, FileImage, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useI18n } from '../i18n';

interface PsdUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function PsdUploader({ onFileSelect, isProcessing }: PsdUploaderProps) {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!file.name.toLowerCase().endsWith('.psd')) {
        setError(t.uploader.invalidFile);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect, t.uploader.invalidFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="file"
          accept=".psd"
          onChange={handleInputChange}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center gap-3">
          {isDragOver ? (
            <FileImage size={48} className="text-purple-500" />
          ) : (
            <Upload size={48} className="text-gray-400" />
          )}

          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragOver ? t.uploader.dropHere : t.uploader.dropzone}
            </p>
            <p className="text-sm text-gray-500 mt-1">{t.uploader.orClick}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
