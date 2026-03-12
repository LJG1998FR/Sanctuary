/**
 * useTimer.js — Hook personnalisé pour gérer un chronomètre
 *
 * 🎓 CONCEPT CLÉ — Pourquoi un custom hook ?
 * On extrait cette logique dans un hook pour qu'elle soit
 * réutilisable dans PuzzlePage ET MemoryPage sans copier-coller.
 * Un hook = une fonction qui commence par "use" et qui peut
 * appeler d'autres hooks React (useState, useEffect, etc.)
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @returns {{
 *   seconds: number,
 *   formatted: string,   // "MM:SS"
 *   isRunning: boolean,
 *   start: Function,
 *   stop: Function,
 *   reset: Function,
 * }}
 */
export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  /**
   * 🎓 CONCEPT CLÉ — useRef pour stocker l'ID de l'interval
   * On NE PEUT PAS stocker l'intervalId dans un useState car
   * changer un état déclenche un re-render, ce qu'on veut éviter ici.
   * useRef crée une "boîte" persistante entre les renders, sans
   * déclencher de re-render quand on la modifie.
   */
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    /**
     * 🎓 CONCEPT CLÉ — Cleanup function
     * Cette fonction retournée par useEffect est appelée AVANT
     * que l'effet ne se re-exécute (ou au démontage du composant).
     * Indispensable pour éviter les fuites mémoire avec les intervals.
     */
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  /**
   * 🎓 CONCEPT CLÉ — useCallback
   * Mémorise la référence de la fonction entre les renders.
   * Sans useCallback, une nouvelle fonction serait créée à chaque
   * render, ce qui peut causer des re-renders inutiles dans les
   * composants enfants qui reçoivent ces fonctions en props.
   */
  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
  }, []);

  /** Formate les secondes en "MM:SS" */
  const formatted = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return { seconds, formatted, isRunning, start, stop, reset };
}
