# 🎮 Mini-Jeux ReactJS — Documentation

> Puzzle + Memory avec photos dynamiques, timer, compteur de mouvements et niveaux de difficulté.

---

## 📁 Structure des fichiers livrés

```
src/
├── api/
│   └── games.js                         ← Appels API (getRandomPhoto, getMemoryPhotos)
│
├── hooks/
│   └── useTimer.js                      ← Hook réutilisable chronomètre
│
├── components/
│   └── Games/
│       ├── GameStats.jsx                ← Affichage temps + mouvements (commun aux 2 jeux)
│       ├── Puzzle/
│       │   └── PuzzleGame.jsx           ← Jeu canvas (adapté de puzzle.js)
│       └── Memory/
│           ├── MemoryCard.jsx           ← Carte individuelle (flip CSS 3D)
│           └── MemoryGame.jsx           ← Logique Memory (grille + vérification paires)
│
├── pages/
│   └── Games/
│       ├── GamesPage.jsx                ← Sélection du jeu (/games)
│       ├── PuzzlePage.jsx               ← Page Puzzle (/games/puzzle)
│       └── MemoryPage.jsx               ← Page Memory (/games/memory)
│
├── styles/
│   └── games.css                        ← Styles complets (thème sombre, animations)
│
└── router-config.jsx                    ← Extrait de configuration React Router v6
```

---

## 🚀 Intégration rapide (4 étapes)

### 1. Copier les fichiers
Copie tous les fichiers dans ton projet en respectant la structure ci-dessus.

### 2. Configurer l'API
Dans ton fichier `.env` à la racine du projet :
```env
REACT_APP_API_URL=http://localhost:3001/api
```
> ⚠️ Les variables d'environnement React **doivent** commencer par `REACT_APP_`.

### 3. Ajouter les routes
Voir `router-config.jsx` — 3 lignes à ajouter dans ton `<Routes>` existant :
```jsx
<Route path="/games"        element={<GamesPage />} />
<Route path="/games/puzzle" element={<PuzzlePage />} />
<Route path="/games/memory" element={<MemoryPage />} />
```

### 4. Importer le CSS
Dans `index.js` ou `App.jsx` :
```js
import './styles/games.css';
```

---

## 🔌 Contrat API attendu

### `GET /api/photos/random`
**Utilisée par** : PuzzlePage (au chargement et à chaque nouvelle partie)

**Réponse attendue :**
```json
{
  "id": 42,
  "url": "/uploads/photos/ma-photo.jpg",
  "filename": "ma-photo.jpg"
}
```

### `GET /api/photos/memory?count=6`
**Utilisée par** : MemoryGame (au montage du composant)

**Réponse attendue :** Un tableau de **N photos distinctes** (`count` = nombre de paires)
```json
[
  { "id": 1, "url": "/uploads/photos/photo-1.jpg", "filename": "photo-1.jpg" },
  { "id": 7, "url": "/uploads/photos/photo-7.jpg", "filename": "photo-7.jpg" },
  ...
]
```

> ⚠️ **Important** : Si tu as moins de photos en base que le `count` demandé,
> le jeu affichera une erreur explicite. Gère ce cas côté backend (retourner une
> erreur 400 avec un message clair).

---

## 🎛️ Niveaux de difficulté

### Puzzle
| Niveau    | Grille  | Pièces |
|-----------|---------|--------|
| Facile    | 2 × 2   | 4      |
| Moyen     | 3 × 3   | 9      |
| Difficile | 4 × 4   | 16     |
| Expert    | 5 × 5   | 25     |

### Memory
| Niveau    | Paires | Cartes |
|-----------|--------|--------|
| Facile    | 4      | 8      |
| Moyen     | 6      | 12     |
| Difficile | 8      | 16     |
| Expert    | 10     | 20     |

---

## 🎓 Concepts React clés utilisés

### `useRef` vs `useState`
- **`useState`** → déclenche un re-render quand il change. Utilisé pour ce que React doit afficher.
- **`useRef`** → ne déclenche **pas** de re-render. Utilisé pour l'état interne du canvas
  (pièces, position souris) et pour stocker des valeurs persistantes (intervalId, callbacks).

### Stale Closures (fermetures périmées)
Dans `PuzzleGame.jsx`, toute la logique canvas est dans un seul `useEffect`. Pourquoi ?
Les event handlers `canvas.onpointerdown = fn` sont définis une fois et appellent `fn`
plus tard. Si `fn` était définie en dehors de l'Effect avec `useCallback`, elle capturerait
les valeurs au moment de sa création, pas au moment de l'exécution. En définissant tout
dans l'Effect, on évite ce piège.

### La prop `key` pour reset un composant
```jsx
<PuzzleGame key={`puzzle-${gameKey}-${difficulty}`} ... />
```
Quand `key` change, React démonte et remonte le composant depuis zéro.
C'est le moyen le plus propre de réinitialiser un composant entier.

### Cleanup des `useEffect`
Chaque `useEffect` retourne une fonction de nettoyage :
- `useTimer` → `clearInterval` pour éviter les fuites mémoire
- `PuzzleGame` → suppression des event listeners canvas
- `MemoryGame` → `cancelled = true` pour annuler les setState sur composant démonté

### Lazy Loading (React.lazy + Suspense)
Les pages des jeux ne sont chargées que lors du premier accès, réduisant le bundle initial.

---

## ⚠️ Points de vigilance

1. **CORS** : Si l'API tourne sur un port différent de React, ajoute `"proxy": "http://localhost:PORT"` dans `package.json` (développement uniquement).

2. **crossOrigin** sur l'image canvas : `img.crossOrigin = 'anonymous'` est nécessaire si l'image ne vient pas du même domaine que la page. Sans ça, `canvas.toDataURL()` lèvera une erreur de sécurité.

3. **Photos insuffisantes** : Le Memory vérifie que l'API renvoie bien le nombre de photos demandé et affiche une erreur explicite sinon.

4. **Police Sora** (optionnel) : Pour le rendu optimal du CSS, ajoute dans `public/index.html` :
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
   ```

---

## 🔮 Améliorations possibles

- **Meilleur score** : Persister le record en `localStorage` (ou BDD) par jeu et difficulté
- **Animations d'entrée** : Stagger les cartes Memory au chargement
- **Son** : Web Audio API pour un feedback sonore sur les paires trouvées
- **Prévisualisation** du puzzle résolu avant de mélanger
- **Partage** : Canvas `toDataURL()` pour télécharger le puzzle résolu
