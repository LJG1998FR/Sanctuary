import React, { useRef, useEffect } from 'react';

const HOVER_TINT = '#22c55e';

function shuffleArray(arr) {
  const o = [...arr]; // Do not change original board
  for (let i = o.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [o[i], o[j]] = [o[j], o[i]]; // Destructuring
  }
  return o;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {string}   props.imageUrl  
 * @param {number}   props.difficulty - Columns/Rows (ex: 3 → grid 3x3)
 * @param {Function} props.onMove
 * @param {Function} props.onStart
 * @param {Function} props.onWin
 */
export default function PuzzleGame({ imageUrl, difficulty, onMove, onStart, onWin }) {

  const canvasRef = useRef(null);
  const onMoveRef = useRef(onMove);
  const onStartRef = useRef(onStart);
  const onWinRef = useRef(onWin);

  useEffect(() => { onMoveRef.current = onMove; }, [onMove]);
  useEffect(() => { onStartRef.current = onStart; }, [onStart]);
  useEffect(() => { onWinRef.current = onWin; }, [onWin]);


  useEffect(() => {
    if (!imageUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stage = canvas.getContext('2d');

    // ─── canvas local state
    let pieces = [];
    let mouse = { x: 0, y: 0 };
    let currentPiece = null;
    let currentDropPiece = null;
    let pieceWidth, pieceHeight, puzzleWidth, puzzleHeight;
    let hasStarted = false;

    // ─── Image load ─────────────────────────────────────────────
    const img = new Image();

    img.onload = () => {

      pieceWidth  = Math.floor(img.width  / difficulty);
      pieceHeight = Math.floor(img.height / difficulty);
      puzzleWidth  = pieceWidth  * difficulty;
      puzzleHeight = pieceHeight * difficulty;

      canvas.width  = puzzleWidth;
      canvas.height = puzzleHeight;
      canvas.style.border = '2px solid rgba(255,255,255,0.15)';

      buildPieces();
      shufflePuzzle();
      canvas.onpointerdown = onPuzzleClick;
    };

    img.src = imageUrl;

    function buildPieces() {
      pieces = [];
      let xPos = 0, yPos = 0;
      for (let i = 0; i < difficulty * difficulty; i++) {
        pieces.push({ sx: xPos, sy: yPos });
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) { xPos = 0; yPos += pieceHeight; }
      }
    }

    function shufflePuzzle() {
      pieces = shuffleArray(pieces);
      stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
      let xPos = 0, yPos = 0;
      for (const piece of pieces) {
        piece.xPos = xPos;
        piece.yPos = yPos;
        drawPiece(piece, xPos, yPos, 1);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) { xPos = 0; yPos += pieceHeight; }
      }
    }

    function drawPiece(piece, x, y, alpha = 1) {
      stage.save();
      stage.globalAlpha = alpha;
      stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, x, y, pieceWidth, pieceHeight);
      stage.restore();
      stage.strokeStyle = 'rgba(255,255,255,0.4)';
      stage.lineWidth = 1.5;
      stage.strokeRect(x, y, pieceWidth, pieceHeight);
    }

    function getPieceUnderMouse() {
      return pieces.find(
        (p) =>
          mouse.x >= p.xPos && mouse.x <= p.xPos + pieceWidth &&
          mouse.y >= p.yPos && mouse.y <= p.yPos + pieceHeight
      ) ?? null;
    }

    /*function updateMouse(e) {
      mouse.x = (e.offsetX !== undefined ? e.offsetX : e.layerX) //- canvas.offsetLeft;
      mouse.y = (e.offsetY !== undefined ? e.offsetY : e.layerY) //- canvas.offsetTop;
    }*/

    function updateMouse(e) {
      // getBoundingClientRect() = real canvas CSS dimensions
      const rect = canvas.getBoundingClientRect();

      // Ratio: internal width (canvas.width) / displayed width (rect.width)
      // Ex: canvas.width=600, rect.width=300 → scaleX = 2
      const scaleX = canvas.width  / rect.width;
      const scaleY = canvas.height / rect.height;

      // e.clientX = position within the browser window
      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top)  * scaleY;
    }

    // ─── Handlers ─────────────────────────────────────────────

    function onPuzzleClick(e) {
      updateMouse(e);
      currentPiece = getPieceUnderMouse();
      if (!currentPiece) return;

      if (!hasStarted) {
        hasStarted = true;
        onStartRef.current?.();
      }


      stage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);

      drawPiece(currentPiece, mouse.x - pieceWidth / 2, mouse.y - pieceHeight / 2, 0.9);

      canvas.onpointermove = onPuzzleMove;
      canvas.onpointerup   = onPieceDropped;
    }

    function onPuzzleMove(e) {
      updateMouse(e);
      currentDropPiece = null;

      stage.clearRect(0, 0, puzzleWidth, puzzleHeight);

      for (const piece of pieces) {
        if (piece === currentPiece) continue;
        drawPiece(piece, piece.xPos, piece.yPos);


        if (
          !currentDropPiece &&
          mouse.x >= piece.xPos && mouse.x <= piece.xPos + pieceWidth &&
          mouse.y >= piece.yPos && mouse.y <= piece.yPos + pieceHeight
        ) {
          currentDropPiece = piece;

          stage.save();
          stage.globalAlpha = 0.35;
          stage.fillStyle = HOVER_TINT;
          stage.fillRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
          stage.restore();
        }
      }


      drawPiece(currentPiece, mouse.x - pieceWidth / 2, mouse.y - pieceHeight / 2, 0.75);
    }

    function onPieceDropped() {
      canvas.onpointermove = null;
      canvas.onpointerup   = null;


      if (currentDropPiece) {
        const tmp = { xPos: currentPiece.xPos, yPos: currentPiece.yPos };
        currentPiece.xPos     = currentDropPiece.xPos;
        currentPiece.yPos     = currentDropPiece.yPos;
        currentDropPiece.xPos = tmp.xPos;
        currentDropPiece.yPos = tmp.yPos;
        onMoveRef.current?.();
      }

      checkWin();
    }

    function checkWin() {
      stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
      let isWin = true;

      for (const piece of pieces) {
        drawPiece(piece, piece.xPos, piece.yPos);
        if (piece.xPos !== piece.sx || piece.yPos !== piece.sy) {
          isWin = false;
        }
      }

      if (isWin) {
        setTimeout(() => onWinRef.current?.(), 500);
      }
    }

    // ─── Cleanup — IMPORTANT to avoid memory leaks ─────────────────

    return () => {
      canvas.onpointerdown = null;
      canvas.onpointermove = null;
      canvas.onpointerup   = null;
    };
  }, [imageUrl, difficulty]);

  return (
    <div className="puzzle-canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="puzzle-canvas"
        style={{ cursor: 'grab', maxWidth: '100%', borderRadius: '8px' }}
      />
    </div>
  );
}
