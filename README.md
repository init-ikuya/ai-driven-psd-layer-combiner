# AI-Driven PSD Layer Combiner

[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://init-ikuya.github.io/ai-driven-psd-layer-combiner/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PSDファイルからレイヤーを抽出し、マルチモーダルLLM（OpenAI GPT-4o）を使って「最適な組み合わせ」と「適切なファイル名」を自動判定し、合成したPNG画像を書き出すWebツールです。

**[デモを試す](https://init-ikuya.github.io/ai-driven-psd-layer-combiner/)**

## 特徴

- **完全ブラウザ動作** - サーバー不要、PSDファイルはローカルで処理
- **AI自動選択** - 「怒っている顔」「夏らしい服装」などの自然言語で指示
- **リアルタイムプレビュー** - 選択したレイヤーの合成結果を即座に確認
- **ズーム&パン** - プレビュー画像を拡大・移動して詳細確認

## 機能

- PSDファイルのドラッグ&ドロップアップロード
- レイヤーの自動抽出とグループ別表示（折りたたみ可能）
- AIによる最適なレイヤー組み合わせの自動選択
- レイヤーの手動選択（チェックボックス）
- グループ単位での一括選択/解除
- 合成プレビュー（ズーム・ドラッグ対応）
- 合成画像のPNGダウンロード

## 使い方

1. 右上の「OpenAI APIの設定」からAPIキーを設定
2. PSDファイルをドラッグ&ドロップ
3. レイヤー一覧が表示されたら、AIへの指示を入力
   - 例: 「怒っている顔」「夏らしい格好」「デフォルトの状態」
4. 「AIで組み合わせを決定」をクリック
5. 合成結果を確認してダウンロード

※ 手動でレイヤーを選択して「選択中のレイヤーで合成」も可能

## 技術スタック

- **フレームワーク**: React 19 + TypeScript + Vite
- **スタイリング**: Tailwind CSS v4
- **PSD解析**: ag-psd
- **アイコン**: Lucide React
- **AI**: OpenAI API (GPT-4o)
- **リンター/フォーマッター**: Biome

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# コードフォーマット
npm run format

# Lint & Format チェック
npm run check
```

## デプロイ

GitHub Pagesに自動デプロイされます。`main`ブランチにプッシュすると、GitHub Actionsが自動的にビルド&デプロイを実行します。

## フィードバック

- バグ報告・機能要望は [Issues](https://github.com/init-ikuya/ai-driven-psd-layer-combiner/issues) へ
- 気に入ったら [Star](https://github.com/init-ikuya/ai-driven-psd-layer-combiner) をお願いします!

## ライセンス

MIT

---

## English

# AI-Driven PSD Layer Combiner

A web tool that extracts layers from PSD files and uses multimodal LLM (OpenAI GPT-4o) to automatically determine the optimal layer combination and appropriate filename, then exports the composited PNG image.

### Features

- **Browser-based** - No server required, PSD files are processed locally
- **AI auto-selection** - Natural language instructions like "angry face" or "summer outfit"
- **Real-time preview** - Instantly see the composited result of selected layers
- **Zoom & Pan** - Zoom and drag to inspect details

### How to Use

1. Set your OpenAI API key from "OpenAI APIの設定" button
2. Drag & drop a PSD file
3. Enter instructions for AI (e.g., "angry face", "summer clothes")
4. Click "AIで組み合わせを決定" to let AI select layers
5. Download the composited image

### License

MIT
