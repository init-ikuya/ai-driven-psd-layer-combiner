import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FolderOpen,
  Layers,
  MinusSquare,
  Square,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import type { LayerInfo } from '../types';

interface LayerPreviewProps {
  layers: LayerInfo[];
  selectedLayers: number[];
  onToggleLayer: (id: number) => void;
  onToggleGroup: (layerIds: number[]) => void;
}

// ツリー構造の型定義
interface LayerTreeNode {
  name: string;
  path: string;
  layers: LayerInfo[];
  children: { [key: string]: LayerTreeNode };
}

function LayerCard({
  layer,
  isSelected,
  onToggle,
}: {
  layer: LayerInfo;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-200'
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      <div className="aspect-square bg-gray-100 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          }}
        />

        {layer.imageDataUrl && (
          <img
            src={layer.imageDataUrl}
            alt={layer.name}
            className="absolute inset-0 w-full h-full object-contain p-2"
          />
        )}

        <div
          className={`absolute top-2 left-2 p-1 rounded-full ${
            isSelected ? 'bg-purple-500 text-white' : 'bg-white/80 text-gray-500'
          }`}
        >
          {isSelected ? <Eye size={14} /> : <EyeOff size={14} />}
        </div>

        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          #{layer.id}
        </div>
      </div>

      <div className="p-2 bg-white">
        <p className="text-xs font-medium text-gray-700 truncate">{layer.name}</p>
      </div>
    </div>
  );
}

// 再帰的にツリーを表示するコンポーネント
function LayerTreeGroup({
  node,
  selectedLayers,
  onToggleLayer,
  onToggleGroup,
  depth = 0,
}: {
  node: LayerTreeNode;
  selectedLayers: number[];
  onToggleLayer: (id: number) => void;
  onToggleGroup: (layerIds: number[]) => void;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const childKeys = Object.keys(node.children);
  const hasChildren = childKeys.length > 0 || node.layers.length > 0;

  // このグループ配下の全レイヤーID
  const allLayerIds = useMemo(() => getAllLayerIds(node), [node]);

  // 選択状態を判定
  const selectedCount = allLayerIds.filter((id) => selectedLayers.includes(id)).length;
  const isAllSelected = selectedCount === allLayerIds.length && allLayerIds.length > 0;
  const isPartialSelected = selectedCount > 0 && selectedCount < allLayerIds.length;

  const handleToggleGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleGroup(allLayerIds);
  };

  return (
    <div className={depth > 0 ? 'ml-4 border-l-2 border-gray-200 pl-3' : ''}>
      {/* グループヘッダー */}
      <div className="flex items-center gap-2 text-gray-600 text-sm font-medium py-2">
        {/* 一括選択ボタン */}
        <button
          type="button"
          onClick={handleToggleGroup}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
          title={isAllSelected ? '全て解除' : '全て選択'}
        >
          {isAllSelected ? (
            <CheckSquare size={18} className="text-purple-500" />
          ) : isPartialSelected ? (
            <MinusSquare size={18} className="text-purple-300" />
          ) : (
            <Square size={18} className="text-gray-400" />
          )}
        </button>

        {/* 展開/折りたたみ */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-gray-800 flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          ) : (
            <span className="w-4" />
          )}
          <FolderOpen size={16} className="text-amber-500" />
          <span>{node.name}</span>
          <span className="text-gray-400 text-xs">
            ({selectedCount}/{allLayerIds.length})
          </span>
        </div>
      </div>

      {/* 展開時の中身 */}
      {isExpanded && (
        <div className="space-y-3">
          {/* 子グループを再帰表示 */}
          {childKeys.map((key) => (
            <LayerTreeGroup
              key={node.children[key].path}
              node={node.children[key]}
              selectedLayers={selectedLayers}
              onToggleLayer={onToggleLayer}
              onToggleGroup={onToggleGroup}
              depth={depth + 1}
            />
          ))}

          {/* このグループ直下のレイヤー */}
          {node.layers.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {node.layers.map((layer) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedLayers.includes(layer.id)}
                  onToggle={() => onToggleLayer(layer.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ノード配下の全レイヤーIDを取得するヘルパー関数
function getAllLayerIds(node: LayerTreeNode): number[] {
  const childIds = Object.keys(node.children).flatMap((key) => getAllLayerIds(node.children[key]));
  const ownIds = node.layers.map((l) => l.id);
  return [...ownIds, ...childIds];
}

// レイヤーをツリー構造に変換する関数
function buildLayerTree(layers: LayerInfo[]): LayerTreeNode {
  const root: LayerTreeNode = {
    name: 'root',
    path: '',
    layers: [],
    children: {},
  };

  layers.forEach((layer) => {
    let current = root;

    // グループパスを辿ってツリーを構築
    layer.groupPath.forEach((groupName, index) => {
      const path = layer.groupPath.slice(0, index + 1).join('/');
      if (!current.children[groupName]) {
        current.children[groupName] = {
          name: groupName,
          path,
          layers: [],
          children: {},
        };
      }
      current = current.children[groupName];
    });

    // 最後のノードにレイヤーを追加
    current.layers.push(layer);
  });

  return root;
}

export function LayerPreview({
  layers,
  selectedLayers,
  onToggleLayer,
  onToggleGroup,
}: LayerPreviewProps) {
  const { t } = useI18n();
  const layerTree = useMemo(() => buildLayerTree(layers), [layers]);

  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Layers size={48} />
        <p className="mt-2">{t.layers.empty}</p>
      </div>
    );
  }

  const rootChildKeys = Object.keys(layerTree.children);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <Layers size={20} />
        <span>{t.layers.title} ({layers.length})</span>
      </div>

      {/* ルート直下のグループを表示 */}
      {rootChildKeys.map((key) => (
        <LayerTreeGroup
          key={layerTree.children[key].path}
          node={layerTree.children[key]}
          selectedLayers={selectedLayers}
          onToggleLayer={onToggleLayer}
          onToggleGroup={onToggleGroup}
        />
      ))}

      {/* グループに属さないレイヤー */}
      {layerTree.layers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium border-b pb-2">
            <FolderOpen size={16} />
            <span>{t.layers.ungrouped}</span>
            <span className="text-gray-400">({layerTree.layers.length})</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {layerTree.layers.map((layer) => (
              <LayerCard
                key={layer.id}
                layer={layer}
                isSelected={selectedLayers.includes(layer.id)}
                onToggle={() => onToggleLayer(layer.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
