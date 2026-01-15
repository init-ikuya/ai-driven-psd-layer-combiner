import type { AiResponse, LayerInfo } from '../types';

function canvasToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

function buildLayerStructureJson(layers: LayerInfo[]): string {
  const structure = layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    group: layer.groupPath.join('/'),
    size: `${layer.width}x${layer.height}`,
    position: `(${layer.left}, ${layer.top})`,
    visible: layer.visible,
  }));
  return JSON.stringify(structure, null, 2);
}

export async function analyzeWithOpenAI(
  apiKey: string,
  contactSheet: HTMLCanvasElement,
  layers: LayerInfo[],
  userPrompt: string,
): Promise<AiResponse> {
  const imageDataUrl = canvasToBase64(contactSheet);
  const layerStructure = buildLayerStructureJson(layers);

  const systemPrompt = `あなたはPSDファイルのレイヤー合成アシスタントです。
ユーザーから提供されたコンタクトシート画像（レイヤー一覧）とレイヤー構造情報を分析し、
ユーザーの要望に最も合う組み合わせを選択してください。

【レイヤー構造】
${layerStructure}

以下のJSON形式で回答してください（他の文章は不要です）：
{
  "selectedLayers": [レイヤーIDの配列（数値）],
  "fileName": "推奨ファイル名.png",
  "reason": "選択理由（短く）"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('No response from AI');
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse AI response as JSON');
  }

  return JSON.parse(jsonMatch[0]) as AiResponse;
}
