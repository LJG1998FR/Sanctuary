
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import PuzzleGame from '@/pages/Games/PuzzleGame';
import GameStats from '@/pages/Games/GameStats';
import { useTimer } from '../../hooks/useTimer';
import { apiService } from '@/api/services';
import { useTranslation } from '../../hooks/useTranslations';

export default function PuzzlePage() {
  const [difficulty, setDifficulty]   = useState(3);
  const [imageUrl, setImageUrl]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [moves, setMoves]             = useState(0);
  const [gameKey, setGameKey]         = useState(0); // Force PuzzleGame re-mount
  const [hasWon, setHasWon]           = useState(false);
  const timer = useTimer();

  const apiUrl = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

  // ─── Difficulty levels ──────────────────────────────
  const DIFFICULTY_LEVELS = [
    { value: 2, label: t('games.puzzle.difficulty_levels.easy.label'),  description: t('games.puzzle.difficulty_levels.easy.description') },
    { value: 3, label: t('games.puzzle.difficulty_levels.normal.label'),  description: t('games.puzzle.difficulty_levels.normal.description') },
    { value: 4, label: t('games.puzzle.difficulty_levels.hard.label'),  description: t('games.puzzle.difficulty_levels.hard.description') },
    { value: 5, label: t('games.puzzle.difficulty_levels.expert.label'),  description: t('games.puzzle.difficulty_levels.expert.description') },
  ];

  // ─── photo loading ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchPhoto() {
      try {
        setLoading(true);
        setError(null);
        const photo = await apiService.getRandomPhoto();
        if (!cancelled) setImageUrl(photo.data.item.photo_collection.slugger+'/'+photo.data.item.filename);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPhoto();
    return () => { cancelled = true; };
  }, [gameKey])

  // ─── PuzzleGame Callbacks ───────────────────────────────────────

  /** Set timer on first move */
  const handleStart = useCallback(() => {
    timer.start();
  }, [timer]);

  /** Increase moves nb */
  const handleMove = useCallback(() => {
    setMoves((prev) => prev + 1);
  }, []);

  const handleWin = useCallback(() => {
    timer.stop();
    setHasWon(true);
  }, [timer]);

  // ─── New game ─────────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    timer.reset();
    setMoves(0);
    setHasWon(false);
    setGameKey((k) => k + 1); // key count increases -> force reload
  }, [timer]);

  // ─── Changing diffculty ─────────────────────────────────────────────
  const handleDifficultyChange = useCallback((newDiff) => {
    setDifficulty(newDiff);
    timer.reset();
    setMoves(0);
    setHasWon(false);
    /**
     * Same image is kept but suffled differently
     */
  }, [timer]);


  /**
   * Score
   */
  const score = hasWon
    ? Math.max(0, Math.round(1000 - moves * 10 - timer.seconds * 2))
    : null;

  // ─── Rendering ──────────────────────────────────────────────────────────────
  return (
    <main className="game-page">
      {/* Navigation */}
      <nav className="game-page__nav">
        <Link to="/games" className="btn btn--ghost">← {t('games.links.back')}</Link>
        <h1 className="game-page__title">🧩 {t('games.puzzle.title')}</h1>
        <button
          className="btn btn--secondary"
          onClick={handleRestart}
          aria-label={t('games.buttons.retry_new_photo')}
        >
          🔄 {t('games.buttons.new_game')}
        </button>
      </nav>

      {/* Selecting difficulty */}
      <div className="difficulty-selector" role="group" aria-label={t('games.puzzle.difficulty_levels.label')}>
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            key={level.value}
            className={`difficulty-btn ${difficulty === level.value ? 'difficulty-btn--active' : ''}`}
            onClick={() => handleDifficultyChange(level.value)}
            aria-pressed={difficulty === level.value}
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
        moves={moves}
        movesLabel={t('games.labels.moves')}
        isRunning={timer.isRunning}
      />

      {/* Loading screen */}
      {loading && (
        <div className="game-loading">
          <div className="game-loading__spinner" />
          <p>{t('games.loading.label')}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="game-error">
          <p>⚠️ {error}</p>
          <button className="btn btn--primary" onClick={handleRestart}>
            {t('games.buttons.retry')}
          </button>
        </div>
      )}

      {/* Victory screen */}
      {hasWon && (
        <div className="game-win-overlay" role="alert" aria-live="polite">
          <div className="game-win-card">
            <span className="game-win-emoji">🎉</span>
            <h2>{t('games.puzzle.victory.title')}</h2>
            <p>
              {t('games.puzzle.victory.stats.time')} <strong>{timer.formatted}</strong> {t('games.puzzle.victory.stats.moves', {moves})}
            </p>
            {score !== null && (
              <p className="game-win-score">{t('games.puzzle.victory.stats.score')} <strong>{score}</strong></p>
            )}
            <button className="btn btn--primary" onClick={handleRestart}>
              {t('games.buttons.retry_new_photo')}
            </button>
          </div>
        </div>
      )}

      {/* Game */}
      {!loading && !error && imageUrl && (
        <div className="game-board">
          <PuzzleGame
            key={`puzzle-${gameKey}-${difficulty}`}
            imageUrl={apiUrl+'/uploads/photos/'+imageUrl}
            difficulty={difficulty}
            onStart={handleStart}
            onMove={handleMove}
            onWin={handleWin}
          />
        </div>
      )}
    </main>
  );
}
