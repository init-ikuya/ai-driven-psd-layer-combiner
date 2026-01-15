import { Download } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { AiPromptInput } from './components/AiPromptInput';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { Header } from './components/Header';
import { LayerPreview } from './components/LayerPreview';
import { PsdUploader } from './components/PsdUploader';
import { StatusBar } from './components/StatusBar';
import { ZoomableImage } from './components/ZoomableImage';
import { useI18n } from './i18n';
import type { AiResponse, ProcessingStatus, PsdData } from './types';
import { analyzeWithOpenAI } from './utils/openaiApi';
import { compositeLayers, generateContactSheet, parsePsdFile } from './utils/psdParser';

function App() {
  const { t } = useI18n();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [psdData, setPsdData] = useState<PsdData | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<number[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [contactSheet, setContactSheet] = useState<HTMLCanvasElement | null>(null);

  // 選択中のレイヤーのリアルタイムプレビュー
  const previewCanvas = useMemo(() => {
    if (!psdData || selectedLayers.length === 0) return null;
    return compositeLayers(psdData.layers, selectedLayers, psdData.width, psdData.height);
  }, [psdData, selectedLayers]);

  const handleSaveApiKey = useCallback((key: string) => {
    setApiKey(key);
  }, []);

  const handleRemoveApiKey = useCallback(() => {
    setApiKey(null);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setStatus('parsing');
    setError(null);
    setAiResponse(null);

    try {
      const data = await parsePsdFile(file);
      setPsdData(data);
      setSelectedLayers(data.layers.filter((l) => l.visible).map((l) => l.id));

      setStatus('generating-contact-sheet');
      const sheet = generateContactSheet(data.layers);
      setContactSheet(sheet);

      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t.app.psdParseFailed);
    }
  }, [t.app.psdParseFailed]);

  const handleToggleLayer = useCallback((id: number) => {
    setSelectedLayers((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  // グループ単位で一括選択/解除
  const handleToggleGroup = useCallback((layerIds: number[]) => {
    setSelectedLayers((prev) => {
      const allSelected = layerIds.every((id) => prev.includes(id));
      if (allSelected) {
        // 全部選択されてたら全部解除
        return prev.filter((id) => !layerIds.includes(id));
      } else {
        // そうでなければ全部選択
        const newIds = layerIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      }
    });
  }, []);

  const handleAiPrompt = useCallback(
    async (prompt: string) => {
      if (!apiKey || !contactSheet || !psdData) return;

      setStatus('ai-analyzing');
      setError(null);

      try {
        const response = await analyzeWithOpenAI(apiKey, contactSheet, psdData.layers, prompt);
        setAiResponse(response);
        setSelectedLayers(response.selectedLayers);
        setStatus('complete');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : t.app.aiAnalysisFailed);
      }
    },
    [apiKey, contactSheet, psdData, t.app.aiAnalysisFailed],
  );

  const handleDownload = useCallback(() => {
    if (!previewCanvas) return;

    const link = document.createElement('a');
    link.download = aiResponse?.fileName ?? 'composite.png';
    link.href = previewCanvas.toDataURL('image/png');
    link.click();
  }, [previewCanvas, aiResponse]);

  const handleManualComposite = useCallback(() => {
    if (!psdData || selectedLayers.length === 0) return;

    setAiResponse({
      selectedLayers,
      fileName: 'composite.png',
      reason: t.app.manualSelection,
    });
    setStatus('complete');
  }, [psdData, selectedLayers, t.app.manualSelection]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} hasApiKey={!!apiKey} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <StatusBar status={status} error={error} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload or Layer Preview */}
          <div className="lg:col-span-2 space-y-6">
            {!psdData ? (
              // アップロード前: ドラッグ＆ドロップエリアのみ
              <div className="bg-white rounded-xl shadow-sm p-6">
                <PsdUploader onFileSelect={handleFileSelect} isProcessing={status === 'parsing'} />
              </div>
            ) : (
              // アップロード後: レイヤー一覧のみ
              <div className="bg-white rounded-xl shadow-sm p-6">
                <LayerPreview
                  layers={psdData.layers}
                  selectedLayers={selectedLayers}
                  onToggleLayer={handleToggleLayer}
                  onToggleGroup={handleToggleGroup}
                />

                <div className="mt-4 pt-4 border-t flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleManualComposite}
                    disabled={selectedLayers.length === 0 || status === 'compositing'}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t.app.compositeSelected}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPsdData(null);
                      setSelectedLayers([]);
                      setContactSheet(null);
                      setAiResponse(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {t.app.loadAnotherFile}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Preview & AI Input & Result */}
          <div className="space-y-6">
            {/* 選択中のレイヤーのプレビュー */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span>{t.preview.title}</span>
              </div>

              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <ZoomableImage
                  canvas={previewCanvas}
                  className="w-full h-full"
                  emptyMessage={t.preview.selectLayers}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500 text-center">
                {t.preview.selectedCount.replace('{count}', String(selectedLayers.length))}
              </p>

              {/* AI分析結果の表示 */}
              {aiResponse && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
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
                </div>
              )}

              {/* ダウンロードボタン */}
              {previewCanvas && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Download size={20} />
                  {t.result.download} {aiResponse?.fileName ?? 'composite.png'}
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <AiPromptInput
                onSubmit={handleAiPrompt}
                isProcessing={status === 'ai-analyzing'}
                disabled={!apiKey || !psdData}
              />

              {!apiKey && (
                <p className="mt-3 text-sm text-amber-600">
                  {t.app.apiKeyRequired}
                </p>
              )}
            </div>

            {contactSheet && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    {t.preview.showContactSheet}
                  </summary>
                  <div className="mt-3">
                    <img
                      src={contactSheet.toDataURL()}
                      alt="Contact Sheet"
                      className="w-full rounded-lg border"
                    />
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </main>

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentApiKey={apiKey}
        onSave={handleSaveApiKey}
        onRemove={handleRemoveApiKey}
      />
    </div>
  );
}

export default App;
