/**
 * @param {Object}   props
 * @param {{ id: number, url: string }} props.card
 * @param {boolean}  props.isFlipped
 * @param {boolean}  props.isMatched
 * @param {Function} props.onClick
 */
export default function MemoryCard({ card, isFlipped, isMatched, onClick }) {
  const isVisible = isFlipped || isMatched;
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <div
      className={[
        'memory-card',
        isVisible  ? 'memory-card--flipped'  : '',
        isMatched  ? 'memory-card--matched'  : '',
      ].join(' ')}

      role="button"
      tabIndex={isMatched ? -1 : 0}
      aria-label={isMatched ? `Paire trouvée` : `Carte face cachée`}
      aria-pressed={isVisible}
      onClick={isMatched ? undefined : onClick}
      onKeyDown={(e) => {
        if (!isMatched && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Face DOWN */}
      <div className="memory-card__back" aria-hidden="true">
        <span className="memory-card__back-icon">?</span>
      </div>

      {/* Face UP */}
      <div className="memory-card__front" aria-hidden={!isVisible}>
        <img
          src={apiUrl+'/uploads/photos/'+card.photo_collection.slugger+'/'+card.filename}
          alt={`Photo ${card.id}`}
          className="memory-card__image"
          loading="lazy"
          draggable={false}
        />
      </div>
    </div>
  );
}
