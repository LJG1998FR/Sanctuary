
import { useNavigate } from 'react-router';
import { useTranslation } from '../../hooks/useTranslations';


export default function GamesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const GAMES = [
    {
      id: 'puzzle',
      title: t('games.puzzle.title'),
      description: t('games.puzzle.description'),
      emoji: '🧩',
      path: '/games/puzzle',
      color: '#6366f1',
    },
    {
      id: 'memory',
      title: t('games.memory.title'),
      description: t('games.memory.description'),
      emoji: '🃏',
      path: '/games/memory',
      color: '#ec4899',
    },
  ];
  return (
    <main className="games-landing">
      <header className="games-landing__header">
        <h1 className="games-landing__title">{t('games.title')}</h1>
        <p className="games-landing__subtitle">
          {t('games.subtitle')}
        </p>
      </header>

      <div className="games-landing__grid">
        {GAMES.map((game) => (
          <button
            key={game.id}
            className="game-card"
            style={{ '--game-color': game.color }}
            onClick={() => navigate(game.path)}
            aria-label={`Jouer au ${game.title}`}
          >
            <span className="game-card__emoji">{game.emoji}</span>
            <h2 className="game-card__title">{game.title}</h2>
            <p className="game-card__description">{game.description}</p>
            <span className="game-card__cta">{t('games.buttons.play')} →</span>
          </button>
        ))}
      </div>
    </main>
  );
}
