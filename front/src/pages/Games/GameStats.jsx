/**
 * GameStats.jsx — Affichage du chronomètre et du compteur d'essais
 *
 * 🎓 CONCEPT CLÉ — Composant "Dumb" (Presentational Component)
 * Ce composant ne contient AUCUNE logique métier. Il reçoit des
 * données via les props et les affiche, c'est tout. C'est une
 * bonne pratique : séparer les composants "intelligents" (qui
 * gèrent la logique) des composants "stupides" (qui affichent).
 *
 * Avantage : réutilisable pour le Puzzle ET le Memory.
 */

import React from 'react';
import { useTranslation } from '../../hooks/useTranslations';

/**
 * @param {Object} props
 * @param {string}  props.time     - Temps formaté "MM:SS"
 * @param {number}  props.moves    - Nombre d'essais/mouvements
 * @param {string}  [props.movesLabel="Mouvements"] - Label personnalisable
 * @param {boolean} [props.isRunning=false]          - Timer en cours ?
 */
export default function GameStats({
  time,
  moves,
  movesLabel = t('games.labels.moves'),
  isRunning = false,
}) {
  const { t } = useTranslation();
  return (
    <div className="game-stats">
      <div className={`stat-card ${isRunning ? 'stat-card--active' : ''}`}>
        <span className="stat-icon">⏱</span>
        <span className="stat-label">{t('games.labels.time')}</span>
        <span className="stat-value stat-value--time">{time}</span>
      </div>

      <div className="stat-card">
        <span className="stat-icon">🔄</span>
        <span className="stat-label">{movesLabel}</span>
        <span className="stat-value">{moves}</span>
      </div>
    </div>
  );
}
