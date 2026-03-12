import React, { useState, useCallback } from 'react';
import { Link } from 'react-router';
import MemoryGame from '@/pages/Games/MemoryGame';
import GameStats from '@/pages/Games/GameStats';
import { useTimer } from '../../hooks/useTimer';
import { useTranslation } from '../../hooks/useTranslations';

export default function MemoryPage() {
  const [pairsCount, setPairsCount] = useState(6);
  const [attempts, setAttempts]     = useState(0);
  const [gameKey, setGameKey]       = useState(0);
  const [hasWon, setHasWon]         = useState(false);

  const timer = useTimer();
  const {t} = useTranslation();

  // ─── Difficulty levels ──────────────────────────────
  const DIFFICULTY_LEVELS = [
    { value: 4, label: t('games.memory.difficulty_levels.easy.label'),  description: t('games.memory.difficulty_levels.easy.description') },
    { value: 6, label: t('games.memory.difficulty_levels.normal.label'),  description: t('games.memory.difficulty_levels.normal.description') },
    { value: 8, label: t('games.memory.difficulty_levels.hard.label'),  description: t('games.memory.difficulty_levels.hard.description') },
    { value: 10, label: t('games.memory.difficulty_levels.expert.label'),  description: t('games.memory.difficulty_levels.expert.description') },
  ];

  const handleStart = useCallback(() => timer.start(), [timer]);

  const handleMove = useCallback(() => {
    setAttempts((prev) => prev + 1);
  }, []);

  const handleWin = useCallback(() => {
    timer.stop();
    setHasWon(true);
  }, [timer]);

  const handleRestart = useCallback(() => {
    timer.reset();
    setAttempts(0);
    setHasWon(false);
    setGameKey((k) => k + 1);
  }, [timer]);

  const handleDifficultyChange = useCallback((value) => {
    setPairsCount(value);
    timer.reset();
    setAttempts(0);
    setHasWon(false);
    setGameKey((k) => k + 1);
  }, [timer]);

  /**
   * Score
   */
  const score = hasWon
    ? Math.max(0, Math.round(1000 - attempts * 10 - timer.seconds * 2))
    : null;

  return (
    <main className="game-page">
      {/* Navigation */}
      <nav className="game-page__nav">
        <Link to="/games" className="btn btn--ghost">← {t('games.links.back')}</Link>
        <h1 className="game-page__title">🃏 {t('games.memory.title')}</h1>
        <button className="btn btn--secondary" onClick={handleRestart}>
          🔄 {t('games.buttons.new_game')}
        </button>
      </nav>

      {/* Selecting difficulty */}
      <div className="difficulty-selector" role="group" aria-label={t('games.puzzle.difficulty_levels.label')}>
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            key={level.value}
            className={`difficulty-btn ${pairsCount === level.value ? 'difficulty-btn--active' : ''}`}
            onClick={() => handleDifficultyChange(level.value)}
            aria-pressed={pairsCount === level.value}
            title={level.description}
          >
            {level.label}
            <small>{level.description}</small>
          </button>
        ))}
      </div>

      {/* Stats */}
      <GameStats
        time={timer.formatted}
        moves={attempts}
        movesLabel={t('games.labels.attempts')}
        isRunning={timer.isRunning}
      />

      {/* Loading screen */}
      {hasWon && (
        <div className="game-win-overlay" role="alert" aria-live="polite">
          <div className="game-win-card">
            <span className="game-win-emoji">🎊</span>
            <h2>{t('games.memory.victory.title')}</h2>
            <p>
              {t('games.memory.victory.stats.time')} <strong>{timer.formatted}</strong> {t('games.memory.victory.stats.attempts', {attempts})}
            </p>
            {score !== null && (
              <p className="game-win-score">{t('games.memory.victory.stats.score')} <strong>{score}</strong></p>
            )}
            <button className="btn btn--primary" onClick={handleRestart}>
              {t('games.buttons.retry')}
            </button>
          </div>
        </div>
      )}

      {/* Game */}
      <div className="game-board">
        <MemoryGame
          key={`memory-${gameKey}-${pairsCount}`}
          pairsCount={pairsCount}
          onStart={handleStart}
          onMove={handleMove}
          onWin={handleWin}
        />
      </div>
    </main>
  );
}
