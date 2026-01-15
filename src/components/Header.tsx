import { Github, Globe, Settings, Star } from 'lucide-react';
import { useI18n } from '../i18n';

const GITHUB_REPO_URL = 'https://github.com/init-ikuya/ai-driven-psd-layer-combiner';

interface HeaderProps {
  onSettingsClick: () => void;
  hasApiKey: boolean;
}

export function Header({ onSettingsClick, hasApiKey }: HeaderProps) {
  const { t, toggleLanguage } = useI18n();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.header.title}</h1>
          <p className="text-purple-100 text-sm">{t.header.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
            >
              <Globe size={16} />
              <span>{t.language.switchTo}</span>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {t.language.tooltip}
              </span>
            </button>
            <a
              href={`${GITHUB_REPO_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
            >
              <Github size={16} />
              <span>{t.header.issueButton}</span>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {t.header.issueTooltip}
              </span>
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
            >
              <Star size={16} />
              <span>{t.header.starButton}</span>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {t.header.starTooltip}
              </span>
            </a>
          </div>
          <button
            type="button"
            onClick={onSettingsClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasApiKey
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300'
            }`}
          >
            <Settings size={20} />
            <span>{t.header.apiSettings}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
