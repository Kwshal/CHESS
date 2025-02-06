let currentPlayer = 'white';
let clickedPiece = null;
// let canMove2Square = true;
let currentSquare = 29;
let currentSquareColor = "white";



function handlePlayerSwitch() {
     currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
     document.getElementById('player').innerText = currentPlayer;
}

const board = document.getElementById('board');
const pieces = document.querySelectorAll('.piece');
const squares = document.querySelectorAll('.square');

function removeHighlights() {
     squares.forEach(square => {
          square.classList.remove('highlight');
     });

}

board.addEventListener('click', function (e) {

     // console.log("empty square", e.target.classList.contains('square'));
     if (e.target.classList.contains('piece') && e.target.id.endsWith(currentPlayer[0])) {
          removeHighlights();
          // console.log('piece clicked');
          // console.log(e.target);
          // console.log(e.target.parentElement);
          // console.log(e.target.parentElement.getAttribute('slot'));

          clickedPiece = e.target;
          // console.log("clickedPiece", clickedPiece.id[3]);

          // console.log(clickedPiece.id);

          currentSquare = parseInt(clickedPiece.parentElement.getAttribute('slot'));
          currentSquareColor = clickedPiece.parentElement.classList[1];

          // console.log("currentSquare", currentSquare);
          // console.log("currentSquareColor", currentSquareColor);

          if (clickedPiece.id.startsWith('p')) {
               pawnyHighlight(e.target.parentElement.classList.contains(`home-row-${currentPlayer[0]}`));
          } else if (clickedPiece.id.startsWith('b')) {
               bishopyHighlight(currentSquareColor);
          } else if (clickedPiece.id.startsWith('r')) {
               rookyHighlight();
          } else if (clickedPiece.id.startsWith('n')) {
               nightyHighlight();
          } else if (clickedPiece.id.startsWith('k')) {
               kingyHighlight();
          } else if (clickedPiece.id.startsWith('q')) {
               bishopyHighlight(currentSquareColor);
               rookyHighlight();
          }
     } else if (e.target.classList.contains('piece') && !e.target.id.endsWith(currentPlayer[0])) {
          if (clickedPiece && e.target.id.endsWith(currentPlayer[0]) && clickedPiece.id.endsWith(currentPlayer[0])) {
               console.log(e.target.id, clickedPiece.id);
               console.log('same color', "condition I");
               return;
          } else {
               if (e.target.parentElement.classList.contains("highlight") && e.target.id[3] !== clickedPiece.id[3]) { // id[3] is the color of the piece
                    console.log(clickedPiece.id, "captured", e.target.id, "condition II");
                    e.target.parentElement.appendChild(clickedPiece);
                    e.target.remove();
                    handlePlayerSwitch();
                    removeHighlights();
               }
          }
     }
     else if (e.target.classList.contains('square')) {
          if (e.target.classList.contains('highlight')) {
               e.target.appendChild(clickedPiece);
               handlePlayerSwitch();
               removeHighlights();
          }
     }
});


let pawnyHighlight = function (homeRow) {
     if (currentPlayer === 'white') {
          if (homeRow) squares[currentSquare - 16 - 1].classList.add('highlight');

          if (squares[currentSquare - 9] && squares[currentSquare - 9].children.length === 0) {
               squares[currentSquare - 9].classList.add('highlight');
          }
          if (squares[currentSquare - 8] && squares[currentSquare - 8].firstElementChild && !squares[currentSquare - 8].firstElementChild.id.endsWith(currentPlayer[0])) {
               if (squares[currentSquare - 8].classList.contains(currentSquareColor)) {
                    squares[currentSquare - 8].classList.add('highlight');
               }
          }
          if (squares[currentSquare - 10] && squares[currentSquare - 10].firstElementChild && !squares[currentSquare - 10].firstElementChild.id.endsWith(currentPlayer[0])) {
               if (squares[currentSquare - 10].classList.contains(currentSquareColor)) {
                    squares[currentSquare - 10].classList.add('highlight');
               }
          }
     } else {
          if (homeRow) squares[currentSquare + 16 - 1].classList.add('highlight');

          if (squares[currentSquare - 9] && squares[currentSquare + 7].children.length === 0) {
               squares[currentSquare + 7].classList.add('highlight');
          }
          if (squares[currentSquare + 8] && squares[currentSquare + 8].firstElementChild && !squares[currentSquare + 8].firstElementChild.id.endsWith(currentPlayer[0])) {
               if (squares[currentSquare + 8].classList.contains(currentSquareColor)) {
                    squares[currentSquare + 8].classList.add('highlight');
               }
          }
          if (squares[currentSquare + 6] && squares[currentSquare + 6].firstElementChild && !squares[currentSquare + 6].firstElementChild.id.endsWith(currentPlayer[0])) {
               if (squares[currentSquare + 6].classList.contains(currentSquareColor)) {
                    squares[currentSquare + 6].classList.add('highlight');
               }
          }

     }
}


let bishopyHighlight = function () {
     for (let i = currentSquare + 9; i <= 64; i += 9) {
          if (!squares[i - 1].classList.contains(currentSquareColor)) break;
          if (squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          squares[i - 1].classList.add('highlight');
     }
     for (let i = currentSquare - 9; i > 0; i -= 9) {
          if (!squares[i - 1].classList.contains(currentSquareColor)) break;
          if (squares[i - 1] && squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          squares[i - 1].classList.add('highlight');
     }
     for (let i = currentSquare + 7; i <= 64; i += 7) {
          if (!squares[i - 1].classList.contains(currentSquareColor)) break;
          if (squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          squares[i - 1].classList.add('highlight');
     }
     for (let i = currentSquare - 7; i > 0; i -= 7) {
          if (!squares[i - 1].classList.contains(currentSquareColor)) break;
          if (squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          squares[i - 1].classList.add('highlight');
     }
}

let rookyHighlight = function () {
     for (let i = currentSquare + 8; i <= 64; i += 8) { // down
          if (squares[i - 1] && squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1] && squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          squares[i - 1].classList.add('highlight');
     }

     for (let i = currentSquare - 8; i >= 1; i -= 8) { // up
          if (squares[i - 1] && squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1] && squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          squares[i - 1].classList.add('highlight');
     }

     for (let i = currentSquare + 1; i <= currentSquare + (8 - (currentSquare % 8)) % 8; i++) { // right
          if (squares[i - 1] && squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1] && squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          if (squares[i - 1]) {
               squares[i - 1].classList.add('highlight');
          }
     }

     for (let i = currentSquare - 1; i >= currentSquare - (currentSquare - 1) % 8; i--) { // left
          if (squares[i - 1] && squares[i - 1].firstElementChild && !squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               squares[i - 1].classList.add('highlight');
               break;
          } else if (squares[i - 1] && squares[i - 1].firstElementChild && squares[i - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
               break;
          }
          squares[i - 1].classList.add('highlight');
     }
}

let nightyHighlight = function () {
     let validSquares = [6, -6, 10, -10, 15, -15, 17, -17];
     for (let square of validSquares) {
          let validd = squares[currentSquare + square - 1] && squares[currentSquare + square - 1].classList[1] !== currentSquareColor;
          let inRange = currentSquare + square <= 64 && currentSquare + square >= 1;
          let ownPiece = squares[currentSquare + square - 1] && squares[currentSquare + square - 1].firstElementChild && squares[currentSquare + square - 1].firstElementChild.id.endsWith(currentPlayer[0]);
          if (validd && inRange && !ownPiece) {
               squares[currentSquare + square - 1].classList.add('highlight');
          }
     };
}
// nightyHighlight();

let kingyHighlight = function () {
     let validSquares = [1, -1, 7, -7, 8, -8, 9, -9];
     for (let square of validSquares) {
          if (currentSquare + square <= 64 && currentSquare + square >= 1) {
               if (squares[currentSquare + square - 1].firstElementChild && !squares[currentSquare + square - 1].firstElementChild.id.endsWith(currentPlayer[0])) {
                    squares[currentSquare + square - 1].classList.add('highlight');
               }
               squares[currentSquare + square - 1].classList.add('highlight');
          }
     };
}
// kingyHighlight();
