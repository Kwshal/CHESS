const board = document.getElementById('board');
const pieces = document.querySelectorAll('.piece');
const squares = document.querySelectorAll('.square');
let currentPlayer = 'white';
let opponentPlayer = 'black';
let clickedPiece = null;
let currentSquare = null;
let currentSquareColor = null;
let castledRookPlace1 = null;
let castlingRook1 = null;
let castledRookPlace2 = null;
let castlingRook2 = null;
let canCastle = false;
let kingCanMove = false;
let kingInCheck = false;
let checkingPiece = null;
// let coveringInt = null;
let interposedSquares = [];
let putsOwnKingInCheck = false;
function handlePlayerSwitch() {
     currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
     opponentPlayer = opponentPlayer === 'white' ? 'black' : 'white';
     document.getElementById('player').innerText = currentPlayer;
}


function removeHighlights() {
     squares.forEach(square => {
          square.classList.remove('highlight');
     });
}
function removeInterposes(square) {
     if (square.classList.contains('interposed'))
          squares.forEach(square => {
               square.classList.remove('interposed');
          });
}
function removeIgnorable() {
     squares.forEach(square => {
          if (square.firstElementChild && square.firstElementChild.classList.contains('ignorable')) square.firstElementChild.classList.remove('ignorable');
     });
}

function checkOwnKing(ownKing) {
     ownKing.parentElement.classList.contains(`${opponentPlayer[0]}-covered`) ? putsOwnKingInCheck = true : putsOwnKingInCheck = false;
     return putsOwnKingInCheck;
}
function checkOppKing(oppKing) {
     oppKing.parentElement.classList.contains(`${currentPlayer[0]}-covered`) ? kingInCheck = true : kingInCheck = false;
     return kingInCheck;
}

function interpositionSquares(oppKing, checkingPiece) {
     interposedSquares = [];
     let kingSquare = Number(oppKing.parentElement.getAttribute('slot'));
     let checkingPieceSqaure = Number(checkingPiece.parentElement.getAttribute("slot"));
     let d = Math.abs(kingSquare - checkingPieceSqaure); // difference
     let n = d % 7 === 0 ? 7 : d % 8 === 0 ? 8 : 1;

     checkingPiece.parentElement.classList.add("interposed")
     if (kingSquare > checkingPieceSqaure) {
          for (let i = checkingPieceSqaure + n; i < kingSquare; i += n) {
               squares[i].classList.add('interposed');
               interposedSquares.push(i);
          }
     } else {
          for (let i = checkingPieceSqaure - n; i > kingSquare; i -= n) {
               squares[i].classList.add('interposed');
               interposedSquares.push(i);
          }
     }
     return interposedSquares;
}

board.addEventListener('click', function (e) {
     let ownPiece = e.target.classList.contains('piece') && e.target.id.endsWith(currentPlayer[0]);
     let oppPiece = e.target.classList.contains('piece') && e.target.id.endsWith(opponentPlayer[0]);
     let oppPieceSquare = e.target.parentElement;
     let oppPieceAttacked = e.target.parentElement.classList.contains('highlight');
     let targetSquare = e.target;
     let targetIsHighlightedSquare = e.target.classList.contains('highlight');
     if (ownPiece) {
          let ownKing = document.getElementById(`k1-${currentPlayer[0]}`);

          removeHighlights();
          // clickedPiece.classList.remove('ignorable')
          removeIgnorable();
          checkingPiece = e.target.id;
          clickedPiece = e.target;
          clickedPiece.classList.add('ignorable');
          // let ignorable = clickedPiece.classList.add('ignorable');

          updateCoveredSquares();
          // checkOwnKing();
          currentSquare = parseInt(clickedPiece.parentElement.getAttribute('slot'));
          currentSquareColor = clickedPiece.parentElement.classList[1];
          // checkOppKing(oppKing)
          // highlight valid moves
          if (checkOwnKing(ownKing)) {

               // console.log("here")
               if (clickedPiece.id.startsWith('p')) {
                    pawnyHighlight(clickedPiece.parentElement.classList.contains(`home-row-${opponentPlayer[0]}`));
               } else if (clickedPiece.id.startsWith('b')) {
                    bishopyHighlight();
               } else if (clickedPiece.id.startsWith('r')) {
                    rookyHighlight();
               } else if (clickedPiece.id.startsWith('n')) {
                    nightyHighlight();
               } else if (clickedPiece.id.startsWith('k')) {
                    kingyHighlight();
               } else if (clickedPiece.id.startsWith('q')) {
                    queenyHighlight();
               }
          }
          else if (!kingInCheck && !checkOwnKing(ownKing)) {
               // console.log("there")
               if (clickedPiece.id.startsWith('p')) {
                    pawnyHighlight(clickedPiece.parentElement.classList.contains(`home-row-${currentPlayer[0]}`));
               } else if (clickedPiece.id.startsWith('b')) {
                    bishopyHighlight(false);
               } else if (clickedPiece.id.startsWith('r')) {
                    rookyHighlight(false);
               } else if (clickedPiece.id.startsWith('n')) {
                    nightyHighlight();
               } else if (clickedPiece.id.startsWith('k')) {
                    kingyHighlight();
               } else if (clickedPiece.id.startsWith('q')) {
                    queenyHighlight();
               }
          } else console.log("III error");

          setTimeout(() => {
               clickedPiece.classList.remove('ignorable');
               updateCoveredSquares();
          }, 1000);

     } else if (oppPiece && oppPieceAttacked) {
          let oppKing = document.getElementById(`k1-${opponentPlayer[0]}`);
          oppPieceSquare.appendChild(clickedPiece);
          removeInterposes(oppPieceSquare);
          // console.log("playedPiece", playedPiece.id);
          // castling
          if (clickedPiece.id.startsWith('k') || clickedPiece.id.startsWith('r')) {
               clickedPiece.classList.add('moved');
               // kingCanMove = false;
          }
          // console.log(clickedPiece.id[0], "---->", e.target.id[0]);
          // console.log(coveredSquares);
          // clickedPiece = null;
          // currentSquare = e.target.parentElement.getAttribute('slot');
          // currentSquareColor = e.target.parentElement.classList[1];
          e.target.remove();
          updateCoveredSquares();
          checkOppKing(oppKing);
          if (checkOppKing(oppKing)) {
               checkingPiece = oppPieceSquare.firstElementChild;
               // interposedSquares();
               // interpositionSquares(oppKing, currentSquare, 8);
               // coveredSquaresFiller(checkingPiece, oppKing, targetSquare);
               // console.log("checkingPiece:", checkingPiece.id, "coveredSquares:", coveredSquares);
          }
          handlePlayerSwitch();
          // checkForChecks();
          removeHighlights();
     }
     else if (targetIsHighlightedSquare) {
          let oppKing = document.getElementById(`k1-${opponentPlayer[0]}`);
          targetSquare.appendChild(clickedPiece);
          removeInterposes(targetSquare);

          // castling
          if (clickedPiece.id.startsWith('k') && canCastle && targetSquare.classList.contains('ooo')) {
               castledRookPlace1.appendChild(castlingRook1);
               canCastle = false;
          } else if (clickedPiece.id.startsWith('k') && canCastle && targetSquare.classList.contains('oo')) {
               castledRookPlace2.appendChild(castlingRook2);
               canCastle = false;
          }
          updateCoveredSquares();
          // checkOppKing(oppKing);
          if (checkOppKing(oppKing)) {
               checkingPiece = clickedPiece;
               interpositionSquares(oppKing, checkingPiece);
               // coveredSquaresFiller(checkingPiece);
               // console.log("checkingPiece:", checkingPiece.id, "coveredSquares:", coveredSquares);
          }

          handlePlayerSwitch();
          // checkForChecks();
          removeHighlights();
          // coveredSquaresFiller(playedPiece);
     } else removeHighlights();
});

let isPawnInterposed = function (n, flipfactor) {
     return squares[currentSquare + n * flipfactor].classList.contains('interposed');
}
let isInterposed = function (n) {
     if (squares[n]) {
     return squares[n].classList.contains('interposed');
     }
}

let pawnyHighlight = function () {
     // coveredSquares = [];
     let flipfactor = currentPlayer === 'white' ? 1 : -1;
     let f = flipfactor;
     let homeRow = squares[currentSquare].classList.contains(`home-row-${currentPlayer[0]}`);
     let pieceInFront = squares[currentSquare - 8 * flipfactor] && squares[currentSquare - 8 * flipfactor].firstElementChild;
     let pieceInFront2 = squares[currentSquare - 16 * flipfactor] && squares[currentSquare - 16 * flipfactor].firstElementChild;
     let pieceInFrontLeft = squares[currentSquare - 9 * flipfactor] && squares[currentSquare - 9 * flipfactor].firstElementChild && !squares[currentSquare - 9 * flipfactor].firstElementChild.id.endsWith(currentPlayer[0]) && squares[currentSquare - 9 * flipfactor].classList.contains(currentSquareColor);
     let pieceInFrontRight = squares[currentSquare - 7 * flipfactor] && squares[currentSquare - 7 * flipfactor].firstElementChild && !squares[currentSquare - 7 * flipfactor].firstElementChild.id.endsWith(currentPlayer[0]) && squares[currentSquare - 7 * flipfactor].classList.contains(currentSquareColor);

     if (kingInCheck) {
          if (!pieceInFront) {
               if (isPawnInterposed(-8, f)) squares[currentSquare - 8 * flipfactor].classList.add('highlight');
               if (homeRow && !pieceInFront2) {
                    if (isPawnInterposed(-16, f)) squares[currentSquare - 16 * flipfactor].classList.add('highlight');
               }
          }
          if (pieceInFrontLeft) {
               if (isPawnInterposed(-9, f)) squares[currentSquare - 9 * flipfactor].classList.add('highlight');
               if (pieceInFrontLeft.id === `k1-${opponentPlayer[0]}`) {
                    opponentKingInCheck = true;
               }
          }
          if (pieceInFrontRight) {
               if (isPawnInterposed(-7, f)) squares[currentSquare - 7 * flipfactor].classList.add('highlight');
               if (pieceInFrontRight.id === `k1-${opponentPlayer[0]}`) {
                    opponentKingInCheck = true;
               }
          }

     } else {
          if (!pieceInFront) {
               squares[currentSquare - 8 * flipfactor].classList.add('highlight');
               if (homeRow && !pieceInFront2) {
                    squares[currentSquare - 16 * flipfactor].classList.add('highlight');
               }
          }
          if (pieceInFrontLeft) {
               squares[currentSquare - 9 * flipfactor].classList.add('highlight');
               if (pieceInFrontLeft.id === `k1-${opponentPlayer[0]}`) {
                    opponentKingInCheck = true;
               }
          }
          if (pieceInFrontRight) {
               squares[currentSquare - 7 * flipfactor].classList.add('highlight');
               if (pieceInFrontRight.id === `k1-${opponentPlayer[0]}`) {
                    opponentKingInCheck = true;
               }
          }
     }
}


let bishopyHighlight = function () {
     // let int;
     // let oppKing = document.getElementById(`k1-${opponentPlayer[0]}`);
     // if (!queen) {
     //      coveredSquares = [];
     // }
     let validSquares = [9, -9, 7, -7];
     if (kingInCheck) {

          for (let square of validSquares) {
               for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                    if (!squares[i].classList.contains(currentSquareColor)) break;
                    if(isInterposed(i)) squares[i].classList.add('highlight');
               }
          }
     } else {
          for (let square of validSquares) {
               for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                    if (!squares[i].classList.contains(currentSquareColor)) break;
                    if (squares[i].firstElementChild && !squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                         // int = square;
                         squares[i].classList.add('highlight');
                         // console.log(coveredSquares);
                         break;
                    } else if (squares[i].firstElementChild && squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                         break;
                    }
                    squares[i].classList.add('highlight');

               }
          }
     }
     // return int;
}

let rookyHighlight = function () {
     // let int;
     // if (!queen) {
     //           coveredSquares = [];
     // }
     let validSquares = [[8, -8], [1, -1]];
     if (kingInCheck) {
          for (let square of validSquares[0]) {
               for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                    if(isInterposed(i)) squares[i].classList.add('highlight');
               }
          }
          for (let square of validSquares[1]) {
               let row = Math.floor(currentSquare / 8);
               for (let i = currentSquare + square; i >= row * 8 && i < (row + 1) * 8; i += square) {
                    if(isInterposed(i)) squares[i].classList.add('highlight');
               }
          }
     }
     else {
          for (let square of validSquares[0]) {
               for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                    if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                         squares[i].classList.add('highlight');
                         // if (checkOppKing(oppKing)) int = square;
                         break;
                    } else if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.id.endsWith(currentPlayer[0])) break;
                    if (squares[i]) squares[i].classList.add('highlight');
                    // console.log(coveredSquares);
                    coveringnInt = square;
               }
          }
          for (let square of validSquares[1]) {
               let row = Math.floor(currentSquare / 8);
               for (let i = currentSquare + square; i >= row * 8 && i < (row + 1) * 8; i += square) {
                    if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                         squares[i].classList.add('highlight');
                         // if (checkOppKing(oppKing)) int = square;
                         break;
                    } else if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.id.endsWith(currentPlayer[0])) break;
                    if (squares[i]) squares[i].classList.add('highlight');
                    // console.log(coveredSquares);
                    // coveredSquares.push(i);
               }
          }
     }
     // return int;
}

let queenyHighlight = function () {
     // coveredSquares = [];
     bishopyHighlight();
     rookyHighlight();
}

let nightyHighlight = function () {
     coveredSquares = [];
     let validSquares = [6, -6, 10, -10, 15, -15, 17, -17];
     if (kingInCheck) {
          
     for (let square of validSquares) {
          let i = currentSquare+square;
          let validd = squares[currentSquare + square] && squares[currentSquare + square].classList[1] !== currentSquareColor;
          let inRange = currentSquare + square <= 64 && currentSquare + square >= 1;
          let ownPiece = squares[currentSquare + square] && squares[currentSquare + square].firstElementChild && squares[currentSquare + square].firstElementChild.id.endsWith(currentPlayer[0]);
          if (validd && inRange && !ownPiece && isInterposed(i)) {
               squares[currentSquare + square].classList.add('highlight');
          }
     }
     }
     else {
     for (let square of validSquares) {
          let validd = squares[currentSquare + square] && squares[currentSquare + square].classList[1] !== currentSquareColor;
          let inRange = currentSquare + square <= 64 && currentSquare + square >= 1;
          let ownPiece = squares[currentSquare + square] && squares[currentSquare + square].firstElementChild && squares[currentSquare + square].firstElementChild.id.endsWith(currentPlayer[0]);
          if (validd && inRange && !ownPiece) {
               squares[currentSquare + square].classList.add('highlight');
          }
     };
     }
}

let kingyHighlight = function () {
     let validSquares = [1, -1, 7, -7, 8, -8, 9, -9];
     for (let square of validSquares) {
          if (currentSquare + square <= 64 && currentSquare + square >= 0 && squares[currentSquare + square] && !squares[currentSquare + square].classList.contains(`${opponentPlayer[0]}-covered`)) {
               if (squares[currentSquare + square] && squares[currentSquare + square].firstElementChild && !squares[currentSquare + square].firstElementChild.id.endsWith(currentPlayer[0])) {
                    squares[currentSquare + square].classList.add('highlight');
                    kingCanMove = true;
               } else if (squares[currentSquare + square] && squares[currentSquare + square].firstElementChild && squares[currentSquare + square].firstElementChild.id.endsWith(currentPlayer[0])) {
                    continue;
               }
               squares[currentSquare + square].classList.add('highlight');
          }
     };
     castleCriteria();
}

let castleCriteria = function () {
     let hasMoved = clickedPiece.classList.contains('moved') || clickedPiece.parentElement.classList.contains(`${opponentPlayer[0]}-covered`);
     let noPieceInBetweenOOO = squares[currentSquare - 1] && !squares[currentSquare - 1].firstElementChild && !squares[currentSquare - 1].classList.contains(`${opponentPlayer[0]}-covered`) && squares[currentSquare - 2] && !squares[currentSquare - 2].firstElementChild && !squares[currentSquare - 2].classList.contains(`${opponentPlayer[0]}-covered`) && squares[currentSquare - 3] && !squares[currentSquare - 3].firstElementChild;
     let noPieceInBetweenOO = squares[currentSquare + 1] && !squares[currentSquare + 1].firstElementChild && !squares[currentSquare + 1].classList.contains(`${opponentPlayer[0]}-covered`) && squares[currentSquare + 2] && !squares[currentSquare + 2].firstElementChild && !squares[currentSquare + 2].classList.contains(`${opponentPlayer[0]}-covered`);
     let rookLeft = squares[currentSquare - 4] && squares[currentSquare - 4].firstElementChild && squares[currentSquare - 4].firstElementChild.id.startsWith('r') && !squares[currentSquare - 4].firstElementChild.classList.contains('moved');
     let rookRight = squares[currentSquare + 3] && squares[currentSquare + 3].firstElementChild && squares[currentSquare + 3].firstElementChild.id.startsWith('r') && !squares[currentSquare + 3].firstElementChild.classList.contains('moved');
     let ooSafe = squares[currentSquare + 1] && !squares[currentSquare + 1].parentElement.classList.contains(`${opponentPlayer[0]}-covered`) && squares[currentSquare + 2] && !squares[currentSquare + 2].parentElement.classList.contains(`${opponentPlayer[0]}-covered`);
     let oooSafe = squares[currentSquare - 1] && !squares[currentSquare - 1].parentElement.classList.contains(`${opponentPlayer[0]}-covered`) && squares[currentSquare - 2] && !squares[currentSquare - 2].parentElement.classList.contains(`${opponentPlayer[0]}-covered`);
     if (!hasMoved && rookLeft && noPieceInBetweenOOO && oooSafe) {
          squares[currentSquare - 2].classList.add('highlight');
          castledRookPlace1 = squares[currentSquare - 1];
          castlingRook1 = squares[currentSquare - 4].firstElementChild;
          canCastle = true;

     }
     if (!hasMoved && rookRight && noPieceInBetweenOO && ooSafe) {
          squares[currentSquare + 2].classList.add('highlight');
          castledRookPlace2 = squares[currentSquare + 1];
          castlingRook2 = squares[currentSquare + 3].firstElementChild;
          canCastle = true;
          // console.log(...squares[currentSquare + 1].classList);
     }
     return canCastle;
}

function updateCoveredSquares() {
     squares.forEach(square => {
          [...square.classList].forEach(cls => {
               if (cls.endsWith('covered')) {
                    square.classList.remove(cls);
               }
          });
     });

     pieces.forEach(piece => {
          if (piece && piece.parentElement) {
               let currentSquareColor = piece.parentElement.classList[1];
               let currentSquare = Number(piece.parentElement.getAttribute('slot'));
               if (piece.id.startsWith("p")) {
                    let flipfactor = piece.id.endsWith("w") ? 1 : -1;
                    if (squares[currentSquare - 9 * flipfactor].classList[1] === currentSquareColor) {
                         squares[currentSquare - 9 * flipfactor].classList.add(`${piece.id[3]}-covered`);
                    }
                    if (squares[currentSquare - 7 * flipfactor].classList[1] === currentSquareColor) {
                         squares[currentSquare - 7 * flipfactor].classList.add(`${piece.id[3]}-covered`);
                    }
               }
               if (piece.id.startsWith("n")) {
                    let validSquares = [6, -6, 10, -10, 15, -15, 17, -17];
                    for (let square of validSquares) {
                         let validd = squares[currentSquare + square] && squares[currentSquare + square].classList[1] !== currentSquareColor;
                         let inRange = currentSquare + square <= 64 && currentSquare + square >= 1;
                         if (validd && inRange) {
                              squares[currentSquare + square].classList.add(`${piece.id[3]}-covered`);
                         }
                    };

               }
               if (piece.id.startsWith("b")) {
                    let validSquares = [9, -9, 7, -7];
                    for (let square of validSquares) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              if (!squares[i].classList.contains(currentSquareColor)) break;
                              // let ignorable = squares[i].firstElementChild.classList.contains("ignorable");
                              if (squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   // break;
                              }
                              else if (squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   break;
                              }
                              squares[i].classList.add(`${piece.id[3]}-covered`);
                         }
                    }

               }
               if (piece.id.startsWith("r")) {
                    let validSquares = [[8, -8], [1, -1]];
                    for (let square of validSquares[0]) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              // let ignorable = squares[i].firstElementChild.classList.contains("ignorable");
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   // break;
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id[3]}-covered`);
                         }
                    }
                    for (let square of validSquares[1]) {
                         let row = Math.floor(currentSquare / 8);
                         for (let i = currentSquare + square; i >= row * 8 && i < (row + 1) * 8; i += square) {
                              // let ignorable = squares[i].firstElementChild.classList.contains("ignorable");
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   // break;
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id[3]}-covered`);
                         }
                    }

               }
               if (piece.id.startsWith('q')) {
                    let validBishopSquares = [9, -9, 7, -7];
                    for (let square of validBishopSquares) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              if (squares[i] && !squares[i].classList.contains(currentSquareColor)) break;
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   // break;
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   break;
                              }
                              squares[i].classList.add(`${piece.id[3]}-covered`);
                         }
                    }
                    let validRookSquares = [[8, -8], [1, -1]];
                    for (let square of validRookSquares[0]) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   // break;
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id[3]}-covered`);
                         }
                    }
                    for (let square of validRookSquares[1]) {
                         let row = Math.floor(currentSquare / 8);
                         for (let i = currentSquare + square; i >= row * 8 && i < (row + 1) * 8; i += square) {
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   // break;
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id[3]}-covered`);
                         }
                    }
               }
               if (piece.id.startsWith('k')) {
                    let validSquares = [1, -1, 7, -7, 8, -8, 9, -9];
                    for (let square of validSquares) {
                         if (currentSquare + square <= 64 && currentSquare + square >= 0) {
                              if (squares[currentSquare + square] && squares[currentSquare + square].firstElementChild) {
                                   squares[currentSquare + square].classList.add(`${piece.id[3]}-covered`);
                              }
                              if (squares[currentSquare + square]) {

                                   squares[currentSquare + square].classList.add(`${piece.id[3]}-covered`);
                              }
                         }
                    };

               }
          }
     });

}

let checkForChecks = function () {
     coveredSquares.some(square => {
          if (squares[square]) {
               if (squares[square].firstElementChild && squares[square].firstElementChild.id.endsWith(`k1-${currentPlayer[0]}`)) {
                    checkingPiece = squares[square].firstElementChild.id;
               }
          }
          opponentKingInCheck = true;
     });
     // return putsOwnKingInCheck;
}