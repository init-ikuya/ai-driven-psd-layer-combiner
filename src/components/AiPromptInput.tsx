import { Loader2, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';

interface AiPromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  disabled: boolean;
}

export function AiPromptInput({ onSubmit, isProcessing, disabled }: AiPromptInputProps) {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');

  const promptSuggestions = useMemo(
    () => [
      t.aiPrompt.quickOptions.angry,
      t.aiPrompt.quickOptions.smile,
      t.aiPrompt.quickOptions.summer,
      t.aiPrompt.quickOptions.winter,
      t.aiPrompt.quickOptions.default,
      t.aiPrompt.quickOptions.sad,
    ],
    [t],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing && !disabled) {
      onSubmit(prompt.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="ai-prompt-input" className="block text-sm font-medium text-gray-700">
          <Wand2 size={16} className="inline mr-1" />
          {t.aiPrompt.label}
        </label>

        <textarea
          id="ai-prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.aiPrompt.placeholder}
          disabled={isProcessing || disabled}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={3}
        />

        <button
          type="submit"
          disabled={!prompt.trim() || isProcessing || disabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {t.aiPrompt.analyzing}
            </>
          ) : (
            <>
              <Wand2 size={20} />
              {t.aiPrompt.submitButton}
            </>
          )}
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-xs text-gray-500">{t.aiPrompt.quickSelectLabel}</p>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isProcessing || disabled}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
