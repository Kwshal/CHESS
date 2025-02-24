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
let putsOwnKingInCheck = false;
let previousSquare = null;

function revertMove(square, piece) {
     square.appendChild(piece);
}

function handlePlayerSwitch() {
     [currentPlayer, opponentPlayer] = [opponentPlayer, currentPlayer];
     document.getElementById('player').innerText = currentPlayer;
}


function removeHighlights() {
     squares.forEach(square => {
          square.classList.remove('highlight');
          square.classList.remove('active');
          square.classList.remove(`${currentPlayer[0]}-en-passant`);
          square.classList.remove(`${currentPlayer[0]}-en-passantable`);
     });
}
// function removeEnPassant() {
//      squares.forEach(square => {
//           square.classList.remove('en-passant');
//      });
// }
function checkOwnKing(ownKing) {
     squareCovered(ownKing.parentElement) ? putsOwnKingInCheck = true : putsOwnKingInCheck = false;
     return putsOwnKingInCheck;
}
function checkOppKing(oppKing) {
     oppKing.parentElement.classList.contains(`${currentPlayer[0]}-covered`) ? kingInCheck = true : kingInCheck = false;
     return kingInCheck;
}
// function setCheckingPiece(king) {
//      pieces.forEach(piece => {
//           if (king.parentElement.classList.contains(`${piece.id}-covered`) && piece.id.endsWith(currentPlayer[0])) {
//                checkingPiece = piece;
//           }
//      });
//      return checkingPiece;
// }

// function interpositionSquares(king) {
//      let ignorablePiece = [...pieces].find(piece => piece.classList.contains('ignorable'));
//      interposedSquares = [];
//      if (setCheckingPiece(king) && ignorablePiece && checkingPiece.id === ignorablePiece.id) {
//           let kingSquare = Number(king.parentElement.getAttribute('slot'));
//           let checkingPieceSqaure = Number(checkingPiece.parentElement.getAttribute("slot"));
//           let d = Math.abs(kingSquare - checkingPieceSqaure); // difference
//           let n = d < 56 && d % 7 === 0 ? 7 : d % 9 === 0 ? 9 : d >= 8 && d % 8 === 0 ? 8 : d < 8 ? 1 : null;

//           checkingPiece.parentElement.classList.add("interposed");
//           if (n !== null) {

//                if (kingSquare > checkingPieceSqaure) {
//                     for (let i = checkingPieceSqaure + n; i < kingSquare; i += n) {
//                          squares[i].classList.add('interposed');
//                          interposedSquares.push(i);
//                     }
//                } else {
//                     for (let i = checkingPieceSqaure - n; i > kingSquare; i -= n) {
//                          squares[i].classList.add('interposed');
//                          interposedSquares.push(i);
//                     }
//                }
//           }
//      }
//      return interposedSquares;
// }

// function checkForCheckmate(king) {
//      let cannotEscapeCheck = interpositionSquares(king).every(square => {
//           squares[square].classList.contains('');
//      });
//      if (checkOppKing(king) && !kingCanMove && interposedSquares.length === 0) {
//           alert('Checkmate');
//      }
// }

board.addEventListener('click', function (e) {
     let ownKing = document.getElementById(`k1-${currentPlayer[0]}`);
     let oppKing = document.getElementById(`k1-${opponentPlayer[0]}`);
     let ownPiece = e.target.classList.contains('piece') && e.target.id.endsWith(currentPlayer[0]);
     let oppPiece = e.target.classList.contains('piece') && e.target.id.endsWith(opponentPlayer[0]);
     let oppPieceSquare = e.target.parentElement;
     let oppPieceAttacked = e.target.parentElement.classList.contains('highlight');
     let targetSquare = e.target;
     let targetIsHighlightedSquare = e.target.classList.contains('highlight');
     if (ownPiece) {
          removeHighlights();
          clickedPiece = e.target;
          previousSquare = clickedPiece.parentElement;
          clickedPiece.parentElement.classList.add('active');
          currentSquare = parseInt(clickedPiece.parentElement.getAttribute('slot'));
          currentSquareColor = clickedPiece.parentElement.classList[1];

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

     } else if (oppPiece && oppPieceAttacked) {
          oppPieceSquare.appendChild(clickedPiece);
          e.target.remove();
          updateCoveredSquares();
          if (checkOwnKing(ownKing)) {
               revertMove(previousSquare, clickedPiece);
               oppPieceSquare.appendChild(e.target);
               removeHighlights();
               return;
          } else {
               e.target.remove();
               if (clickedPiece.id.startsWith('k') || clickedPiece.id.startsWith('r')) {
                    clickedPiece.classList.add('moved');
               }
               handlePlayerSwitch();
               // checkForCheckmate();
          }
          removeHighlights();
          // removeEnPassant();
     }
     else if (targetIsHighlightedSquare) {
          let enPassantablePieceSquare = document.querySelector(`.${opponentPlayer[0]}-en-passantable`);               
          let enPassantablePiece = enPassantablePieceSquare?.firstElementChild;
          targetSquare.appendChild(clickedPiece);
          if (clickedPiece.id.startsWith('p') && targetSquare.classList.contains(`${opponentPlayer[0]}-en-passant`)) {
               enPassantablePieceSquare.firstElementChild.remove();
          }
          updateCoveredSquares();
          if (checkOwnKing(ownKing)) {
               revertMove(previousSquare, clickedPiece);
               if (clickedPiece.id.startsWith('p') && targetSquare.classList.contains(`${opponentPlayer[0]}-en-passant`)) {
                    enPassantablePieceSquare.appendChild(enPassantablePiece);
               }
               removeHighlights();
               return;
          } else {
               if (clickedPiece.id.startsWith('k') && canCastle && targetSquare.classList.contains('ooo')) {
                    castledRookPlace1.appendChild(castlingRook1);
                    canCastle = false;
               } else if (clickedPiece.id.startsWith('k') && canCastle && targetSquare.classList.contains('oo')) {
                    castledRookPlace2.appendChild(castlingRook2);
                    canCastle = false;
               }
               // checkForCheckmate();
               handlePlayerSwitch();
               removeHighlights();
               // removeEnPassant();
          }
     } else removeHighlights();
});


let pawnyHighlight = function () {
     let flipfactor = currentPlayer === 'white' ? 1 : -1;
     let f = flipfactor;
     let homeRow = squares[currentSquare].classList.contains(`home-row-${currentPlayer[0]}`);
     let pieceInFront = squares[currentSquare - 8 * flipfactor] && squares[currentSquare - 8 * flipfactor].firstElementChild;
     let pieceInFront2 = squares[currentSquare - 16 * flipfactor] && squares[currentSquare - 16 * flipfactor].firstElementChild;
     let pieceInFrontLeft = squares[currentSquare - 9 * flipfactor] && ((squares[currentSquare - 9 * flipfactor].firstElementChild && !squares[currentSquare - 9 * flipfactor].firstElementChild.id.endsWith(currentPlayer[0])) || squares[currentSquare - 9 * flipfactor].classList.contains(`${opponentPlayer[0]}-en-passant`)) && squares[currentSquare - 9 * flipfactor].classList.contains(currentSquareColor);
     let pieceInFrontRight = squares[currentSquare - 7 * flipfactor] && ((squares[currentSquare - 7 * flipfactor].firstElementChild && !squares[currentSquare - 7 * flipfactor].firstElementChild.id.endsWith(currentPlayer[0])) || squares[currentSquare - 7 * flipfactor].classList.contains(`${opponentPlayer[0]}-en-passant`)) && squares[currentSquare - 7 * flipfactor].classList.contains(currentSquareColor);

     if (!pieceInFront) {
          if (squares[currentSquare - 8 * flipfactor]) squares[currentSquare - 8 * flipfactor].classList.add('highlight');
          if (homeRow && !pieceInFront2) {
               if (squares[currentSquare - 16 * flipfactor]) squares[currentSquare - 16 * flipfactor].classList.add('highlight',`${currentPlayer[0]}-en-passantable`);
               if (squares[currentSquare - 8 * flipfactor]) squares[currentSquare - 8 * flipfactor].classList.add(`${currentPlayer[0]}-en-passant`);
          }
     }
     if (pieceInFrontLeft) {
          if (squares[currentSquare - 9 * flipfactor]) squares[currentSquare - 9 * flipfactor].classList.add('highlight');
     }
     if (pieceInFrontRight) {
          if (squares[currentSquare - 7 * flipfactor]) squares[currentSquare - 7 * flipfactor].classList.add('highlight');
     }
}


let bishopyHighlight = function () {
     let validSquares = [9, -9, 7, -7];
     for (let square of validSquares) {
          for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
               if (squares[i] && !squares[i].classList.contains(currentSquareColor)) break;
               if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                    squares[i].classList.add('highlight');
                    break;
               } else if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                    break;
               }
               if (squares[i]) squares[i].classList.add('highlight');
          }
     }
}

let rookyHighlight = function () {
     let validSquares = [[8, -8], [1, -1]];
     for (let square of validSquares[0]) {
          for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
               if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                    squares[i].classList.add('highlight');
                    break;
               } else if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.id.endsWith(currentPlayer[0])) break;
               if (squares[i]) squares[i].classList.add('highlight');
               coveringnInt = square;
          }
     }
     for (let square of validSquares[1]) {
          let row = Math.floor(currentSquare / 8);
          for (let i = currentSquare + square; i >= row * 8 && i < (row + 1) * 8; i += square) {
               if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.id.endsWith(currentPlayer[0])) {
                    squares[i].classList.add('highlight');
                    break;
               } else if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.id.endsWith(currentPlayer[0])) break;
               if (squares[i]) squares[i].classList.add('highlight');
          }
     }
}

let queenyHighlight = function () {
     bishopyHighlight();
     rookyHighlight();
}

let nightyHighlight = function () {
     let validSquares = [6, -6, 10, -10, 15, -15, 17, -17];
     for (let square of validSquares) {
          let validd = squares[currentSquare + square] && squares[currentSquare + square].classList[1] !== currentSquareColor;
          let inRange = currentSquare + square <= 64 && currentSquare + square >= 1;
          let ownPiece = squares[currentSquare + square] && squares[currentSquare + square].firstElementChild && squares[currentSquare + square].firstElementChild.id.endsWith(currentPlayer[0]);
          if (validd && inRange && !ownPiece) {
               squares[currentSquare + square].classList.add('highlight');
          }
     };
}

let kingyHighlight = function () {
     let validSquares = [7, -7, 1, -1, 8, -8, 9, -9];
     for (let square of validSquares) {
          let mod8 = currentSquare % 8;
          let legal = (currentSquare + square) % 8 === mod8 + 1 || (currentSquare + square) % 8 === mod8 - 1 || (currentSquare + square) % 8 === mod8;
          if (currentSquare + square <= 64 && currentSquare + square >= 0 && squares[currentSquare + square] && !squareCovered(squares[currentSquare + square]) && legal) {
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
     let hasMoved = clickedPiece.classList.contains('moved') || squareCovered(clickedPiece.parentElement);
     let noPieceInBetweenOOO = squares[currentSquare - 1] && !squares[currentSquare - 1].firstElementChild && !squareCovered(squares[currentSquare - 1]) && squares[currentSquare - 2] && !squares[currentSquare - 2].firstElementChild && !squareCovered(squares[currentSquare - 2]) && squares[currentSquare - 3] && !squares[currentSquare - 3].firstElementChild;
     let noPieceInBetweenOO = squares[currentSquare + 1] && !squares[currentSquare + 1].firstElementChild && !squareCovered(squares[currentSquare + 1]) && squares[currentSquare + 2] && !squares[currentSquare + 2].firstElementChild && !squareCovered(squares[currentSquare + 2]);
     let rookLeft = squares[currentSquare - 4] && squares[currentSquare - 4].firstElementChild && squares[currentSquare - 4].firstElementChild.id.startsWith('r') && !squares[currentSquare - 4].firstElementChild.classList.contains('moved');
     let rookRight = squares[currentSquare + 3] && squares[currentSquare + 3].firstElementChild && squares[currentSquare + 3].firstElementChild.id.startsWith('r') && !squares[currentSquare + 3].firstElementChild.classList.contains('moved');
     let ooSafe = squares[currentSquare + 1] && !squareCovered(squares[currentSquare + 1].parentElement) && squares[currentSquare + 2] && !squareCovered(squares[currentSquare + 2].parentElement);
     let oooSafe = squares[currentSquare - 1] && !squareCovered(squares[currentSquare - 1].parentElement) && squares[currentSquare - 2] && !squareCovered(squares[currentSquare - 2].parentElement);
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
                    if (squares[currentSquare - 9 * flipfactor] && squares[currentSquare - 9 * flipfactor].classList[1] === currentSquareColor) {
                         squares[currentSquare - 9 * flipfactor].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                    }
                    if (squares[currentSquare - 9 * flipfactor] && squares[currentSquare - 7 * flipfactor].classList[1] === currentSquareColor) {
                         squares[currentSquare - 7 * flipfactor].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                    }
               }
               if (piece.id.startsWith("n")) {
                    let validSquares = [6, -6, 10, -10, 15, -15, 17, -17];
                    for (let square of validSquares) {
                         let validd = squares[currentSquare + square] && squares[currentSquare + square].classList[1] !== currentSquareColor;
                         let inRange = currentSquare + square <= 64 && currentSquare + square >= 1;
                         if (validd && inRange) {
                              squares[currentSquare + square].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                         }
                    };

               }
               if (piece.id.startsWith("b")) {
                    let validSquares = [9, -9, 7, -7];
                    for (let square of validSquares) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              if (!squares[i].classList.contains(currentSquareColor)) break;
                              if (squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                              }
                              else if (squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                                   break;
                              }
                              squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                         }
                    }

               }
               if (piece.id.startsWith("r")) {
                    let validSquares = [[8, -8], [1, -1]];
                    for (let square of validSquares[0]) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                         }
                    }
                    for (let square of validSquares[1]) {
                         let row = Math.floor(currentSquare / 8);
                         for (let i = currentSquare + square; i >= row * 8 && i < (row + 1) * 8; i += square) {
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                         }
                    }

               }
               if (piece.id.startsWith('q')) {
                    let validBishopSquares = [9, -9, 7, -7];
                    for (let square of validBishopSquares) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              if (squares[i] && !squares[i].classList.contains(currentSquareColor)) break;
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                         }
                    }
                    let validRookSquares = [[8, -8], [1, -1]];
                    for (let square of validRookSquares[0]) {
                         for (let i = currentSquare + square; i <= 64 && i >= 0; i += square) {
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                         }
                    }
                    for (let square of validRookSquares[1]) {
                         let row = Math.floor(currentSquare / 8);
                         for (let i = currentSquare + square; i >= row * 8 && i < (row + 1) * 8; i += square) {
                              if (squares[i] && squares[i].firstElementChild && squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                              }
                              else if (squares[i] && squares[i].firstElementChild && !squares[i].firstElementChild.classList.contains("ignorable")) {
                                   squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                                   break;
                              }
                              if (squares[i]) squares[i].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                         }
                    }
               }
               if (piece.id.startsWith('k')) {
                    let validSquares = [1, -1, 7, -7, 8, -8, 9, -9];
                    for (let square of validSquares) {
                         let mod8 = currentSquare % 8;
                         let legal = (currentSquare + square) % 8 === mod8 + 1 || (currentSquare + square) % 8 === mod8 - 1 || (currentSquare + square) % 8 === mod8;

                         if (currentSquare + square <= 64 && currentSquare + square >= 0 && squares[currentSquare + square] && legal) {
                              if (squares[currentSquare + square] && squares[currentSquare + square].firstElementChild) {
                                   squares[currentSquare + square].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
                              }
                              if (squares[currentSquare + square]) {

                                   squares[currentSquare + square].classList.add(`${piece.id}-covered`, `${piece.id[3]}-covered`);
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
}

function squareCovered(piece) {
     const classArray = [...piece.classList];
     for (let cls of classArray) {
          if (cls.endsWith(`${opponentPlayer[0]}-covered`)) {
               return true;
          }
     }
}