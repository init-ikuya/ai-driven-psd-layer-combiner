import { Key, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../i18n';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string | null;
  onSave: (key: string) => void;
  onRemove: () => void;
}

export function ApiSettingsModal({
  isOpen,
  onClose,
  currentApiKey,
  onSave,
  onRemove,
}: ApiSettingsModalProps) {
  const { t } = useI18n();
  const [apiKey, setApiKey] = useState(currentApiKey || '');

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  const handleRemove = () => {
    setApiKey('');
    onRemove();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{t.apiSettings.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 mb-2">
            <Key size={16} className="inline mr-1" />
            {t.apiSettings.apiKeyLabel}
          </label>
          <input
            id="api-key-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t.apiSettings.apiKeyPlaceholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="mt-2 text-xs text-gray-500">
            {t.apiSettings.securityNote}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline ml-1"
            >
              {t.apiSettings.getApiKey}
            </a>
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-xl">
          {currentApiKey && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              {t.apiSettings.deleteButton}
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t.apiSettings.cancelButton}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t.apiSettings.saveButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
