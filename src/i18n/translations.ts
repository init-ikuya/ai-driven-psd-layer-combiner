export const translations = {
  ja: {
    // Header
    header: {
      title: "AI-Driven PSD Layer Combiner",
      subtitle: "PSDレイヤーをAIが最適に組み合わせます",
      issueButton: "Issue",
      starButton: "Star",
      issueTooltip: "要望・バグ報告はこちら",
      starTooltip: "気に入ったらStarしてね",
      apiSettings: "OpenAI APIの設定",
    },
    // PsdUploader
    uploader: {
      dropzone: "PSDファイルをドラッグ&ドロップ",
      dropHere: "ここにドロップ！",
      orClick: "またはクリックしてファイルを選択",
      invalidFile: "PSDファイルを選択してください",
    },
    // LayerPreview
    layers: {
      title: "レイヤー一覧",
      empty: "PSDを読み込むとレイヤーが表示されます",
      ungrouped: "その他",
      selected: "選択中",
    },
    // StatusBar
    status: {
      waitingUpload: "PSDファイルをアップロードしてください",
      parsingPsd: "PSDを解析中...",
      generatingContactSheet: "コンタクトシートを生成中...",
      aiAnalyzing: "AIが最適な組み合わせを考え中...",
      compositing: "レイヤーを合成中...",
      complete: "完了！",
      error: "エラーが発生しました",
    },
    // AiPromptInput
    aiPrompt: {
      label: "AIへの指示",
      placeholder: "例: 怒っている顔、夏らしい格好...",
      submitButton: "AIで組み合わせを決定",
      analyzing: "AIが解析中...",
      quickSelectLabel: "クイック選択：",
      quickOptions: {
        angry: "怒っている顔",
        smile: "笑顔",
        summer: "夏らしい格好",
        winter: "冬服",
        default: "デフォルトの立ち絵",
        sad: "悲しい表情",
      },
    },
    // ResultPreview
    result: {
      title: "合成結果",
      compositing: "合成中...",
      placeholder: "AIが選んだ結果がここに表示されます",
      suggestedFilename: "提案ファイル名",
      reason: "理由",
      selectedLayers: "選択レイヤー",
      download: "をダウンロード",
    },
    // ApiSettingsModal
    apiSettings: {
      title: "OpenAI API設定",
      apiKeyLabel: "APIキー",
      apiKeyPlaceholder: "sk-...",
      securityNote:
        "セキュリティのため、APIキーはブラウザに保存されません（リロードで消えます）。",
      getApiKey: "APIキーを取得",
      deleteButton: "削除",
      cancelButton: "キャンセル",
      saveButton: "保存",
    },
    // Preview
    preview: {
      title: "プレビュー",
      selectLayers: "レイヤーを選択してください",
      selectedCount: "選択中: {count} レイヤー",
      showContactSheet: "コンタクトシート（AIに送信される画像）を表示",
    },
    // App
    app: {
      compositeSelected: "選択中のレイヤーで合成",
      loadAnotherFile: "別のファイルを読み込む",
      apiKeyRequired: "※ AIを使うには、まずAPIキーを設定してください",
      manualSelection: "手動選択",
      psdParseFailed: "PSD解析に失敗しました",
      aiAnalysisFailed: "AI解析に失敗しました",
    },
    // Language
    language: {
      switchTo: "English",
      tooltip: "Switch to English",
    },
  },
  en: {
    // Header
    header: {
      title: "AI-Driven PSD Layer Combiner",
      subtitle: "AI optimizes layer combinations from your PSD",
      issueButton: "Issue",
      starButton: "Star",
      issueTooltip: "Report bugs or feature requests",
      starTooltip: "Star if you like it!",
      apiSettings: "OpenAI API Settings",
    },
    // PsdUploader
    uploader: {
      dropzone: "Drag & Drop PSD File",
      dropHere: "Drop here!",
      orClick: "or click to select a file",
      invalidFile: "Please select a PSD file",
    },
    // LayerPreview
    layers: {
      title: "Layers",
      empty: "Layers will appear after loading a PSD",
      ungrouped: "Others",
      selected: "Selected",
    },
    // StatusBar
    status: {
      waitingUpload: "Please upload a PSD file",
      parsingPsd: "Parsing PSD...",
      generatingContactSheet: "Generating contact sheet...",
      aiAnalyzing: "AI is analyzing the best combination...",
      compositing: "Compositing layers...",
      complete: "Complete!",
      error: "An error occurred",
    },
    // AiPromptInput
    aiPrompt: {
      label: "Instructions for AI",
      placeholder: "e.g., angry face, summer outfit...",
      submitButton: "Determine Combination with AI",
      analyzing: "AI is analyzing...",
      quickSelectLabel: "Quick select:",
      quickOptions: {
        angry: "Angry face",
        smile: "Smile",
        summer: "Summer outfit",
        winter: "Winter clothes",
        default: "Default pose",
        sad: "Sad expression",
      },
    },
    // ResultPreview
    result: {
      title: "Composite Result",
      compositing: "Compositing...",
      placeholder: "AI-selected result will appear here",
      suggestedFilename: "Suggested filename",
      reason: "Reason",
      selectedLayers: "Selected layers",
      download: "Download",
    },
    // ApiSettingsModal
    apiSettings: {
      title: "OpenAI API Settings",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "sk-...",
      securityNote:
        "For security, API key is not saved in browser (cleared on reload).",
      getApiKey: "Get API Key",
      deleteButton: "Delete",
      cancelButton: "Cancel",
      saveButton: "Save",
    },
    // Preview
    preview: {
      title: "Preview",
      selectLayers: "Please select layers",
      selectedCount: "Selected: {count} layers",
      showContactSheet: "Show contact sheet (image sent to AI)",
    },
    // App
    app: {
      compositeSelected: "Composite Selected Layers",
      loadAnotherFile: "Load Another File",
      apiKeyRequired: "* Set up your API key first to use AI",
      manualSelection: "Manual selection",
      psdParseFailed: "Failed to parse PSD",
      aiAnalysisFailed: "AI analysis failed",
    },
    // Language
    language: {
      switchTo: "日本語",
      tooltip: "日本語に切り替え",
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.ja;
