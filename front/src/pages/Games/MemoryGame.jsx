import React, { useState, useEffect, useCallback } from 'react';
import MemoryCard from './MemoryCard';
import { apiService } from '@/api/services';
import { useTranslation } from '../../hooks/useTranslations';

// ---------------------------------------------------------------------------
// Utilitaire
// ---------------------------------------------------------------------------
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

/**
 * @param {Object}   props
 * @param {number}   props.pairsCount  - Numbers of pairs (ex: 6 → 12 cards)
 * @param {Function} props.onMove
 * @param {Function} props.onStart
 * @param {Function} props.onWin
 */
export default function MemoryGame({ pairsCount, onMove, onStart, onWin }) {
  const [cards, setCards]       = useState([]);
  const [flipped, setFlipped]   = useState([]);   // Max 2
  const [matched, setMatched]   = useState([]);   // photos IDs
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const { t } = useTranslation();

  // ─── photos load ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false; // Avoid updates on unmounting

    async function loadCards() {
      try {
        setLoading(true);
        setError(null);
        const photos = await apiService.getMemoryPhotos(pairsCount)
        .then((resp) => {
          return resp.data.photos;
        })

        if (photos.length < pairsCount) {
          throw new Error(
            `API returned ${photos.length} photos, but ${pairsCount} are required.`
          );
        }

        if (cancelled) return;

        const doubled = shuffleArray([
          ...photos.map((p, i) => ({ ...p, uniqueId: `a-${i}` })),
          ...photos.map((p, i) => ({ ...p, uniqueId: `b-${i}` })),
        ]);

        setCards(doubled);
        setFlipped([]);
        setMatched([]);
        setHasStarted(false);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCards();

    return () => { cancelled = true; };
  }, [pairsCount]);

  // ───  click Handler ────────────────────────────────────────────────────
  const handleCardClick = useCallback(
    (card) => {

      if (isLocked) return;
      if (flipped.length >= 2) return;
      if (flipped.some((c) => c.uniqueId === card.uniqueId)) return; // Same card
      if (matched.includes(card.id)) return;

      if (!hasStarted) {
        setHasStarted(true);
        onStart?.();
      }

      const newFlipped = [...flipped, card];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        onMove?.();
        const [first, second] = newFlipped;

        if (first.id === second.id) {
          const newMatched = [...matched, first.id];
          setMatched(newMatched);
          setFlipped([]);

          if (newMatched.length === pairsCount) {
            setTimeout(() => onWin?.(), 600);
          }
        } else {
          setIsLocked(true);
          setTimeout(() => {
            setFlipped([]);
            setIsLocked(false);
          }, 1000);
        }
      }
    },
    [flipped, matched, isLocked, hasStarted, pairsCount, onMove, onStart, onWin]
  );

  const totalCards = pairsCount * 2;
  const cols = Math.ceil(Math.sqrt(totalCards));

  // ─── Renderer ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="memory-loading">
        <div className="memory-loading__spinner" />
        <p>{t('games.loading.label')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="memory-error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div
      className="memory-grid"
      style={{ '--grid-cols': cols }}
      role="grid"
      aria-label="Jeu de Memory"
    >
      {cards.map((card) => (
        <MemoryCard
          key={card.uniqueId}
          card={card}
          isFlipped={flipped.some((c) => c.uniqueId === card.uniqueId)}
          isMatched={matched.includes(card.id)}
          onClick={() => handleCardClick(card)}
        />
      ))}
    </div>
  );
}
