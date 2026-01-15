import { AlertCircle, CheckCircle, FileImage, Layers, Loader2, Wand2 } from 'lucide-react';
import { useMemo } from 'react';
import { useI18n } from '../i18n';
import type { ProcessingStatus } from '../types';

interface StatusBarProps {
  status: ProcessingStatus;
  error?: string | null;
}

export function StatusBar({ status, error }: StatusBarProps) {
  const { t } = useI18n();

  const statusConfig = useMemo(
    () => ({
      idle: {
        icon: <FileImage size={16} />,
        message: t.status.waitingUpload,
        color: 'bg-gray-100 text-gray-600',
      },
      parsing: {
        icon: <Loader2 size={16} className="animate-spin" />,
        message: t.status.parsingPsd,
        color: 'bg-blue-100 text-blue-700',
      },
      'generating-contact-sheet': {
        icon: <Layers size={16} />,
        message: t.status.generatingContactSheet,
        color: 'bg-blue-100 text-blue-700',
      },
      'ai-analyzing': {
        icon: <Wand2 size={16} className="animate-pulse" />,
        message: t.status.aiAnalyzing,
        color: 'bg-purple-100 text-purple-700',
      },
      compositing: {
        icon: <Loader2 size={16} className="animate-spin" />,
        message: t.status.compositing,
        color: 'bg-blue-100 text-blue-700',
      },
      complete: {
        icon: <CheckCircle size={16} />,
        message: t.status.complete,
        color: 'bg-green-100 text-green-700',
      },
      error: {
        icon: <AlertCircle size={16} />,
        message: t.status.error,
        color: 'bg-red-100 text-red-700',
      },
    }),
    [t],
  );

  const config = statusConfig[status];

  if (status === 'idle') return null;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${config.color}`}>
      {config.icon}
      <span className="text-sm font-medium">
        {status === 'error' && error ? error : config.message}
      </span>
    </div>
  );
}
