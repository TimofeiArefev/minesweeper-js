const xSize = 10;
const ySize = 10;

const isBorderCell = (cellNumber) => {
  return cellNumber % xSize == 0 || cellNumber % xSize == xSize - 1;
};

const isBorderLeft = (cellNumber) => {
  return cellNumber % xSize == 0;
};

const isBorderRight = (cellNumber) => {
  return cellNumber % xSize == xSize - 1;
};

const isInvalidCell = (currentNumber, cellId) => {
  if (isBorderLeft(currentNumber)) {
    return [
      currentNumber - 1,
      currentNumber - 1 - xSize,
      currentNumber - 1 + xSize,
    ].includes(cellId);
  }
  if (isBorderRight(currentNumber)) {
    // console.log("america ya :D", currentNumber + 1);
    return [
      +currentNumber + 1,
      +currentNumber + 1 - xSize,
      +currentNumber + 1 + xSize,
    ].includes(cellId);
  }
  return false;
};

function countSurrounding(elements, currentNumber) {
  let minesAmount = 0;

  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      cellId = Number(currentNumber) + x + y * 10;
      if (
        cellId < ySize * xSize &&
        cellId >= 0 &&
        !isInvalidCell(currentNumber, cellId)
      ) {
        let currentElement = elements[Number(currentNumber) + x + y * 10];
        if (
          currentElement.classList[2] == "cellMine" ||
          currentElement.classList[2] == "mine"
        ) {
          minesAmount++;
        }
      }
    }
  }
  return minesAmount;
}
const isOpen = (elements, currentNumber) => {
  return (
    elements[currentNumber].classList.contains("freeCell") ||
    elements[currentNumber].classList.contains("mine")
  );
};
const isNotOpen = (elements, currentNumber) => {
  return elements[currentNumber].classList.contains("cell");
};

const isMine = (elements, currentNumber) => {
  return (
    elements[currentNumber].classList.contains("cellMine") ||
    elements[currentNumber].classList.contains("mine")
  );
};

const openCell = (currentElement, minesAmount) => {
  setMinesAmountInsideDiv(currentElement, minesAmount);
  currentElement.classList.replace("cell", "freeCell");
  currentElement.removeEventListener("click", handleClick);
};

const countMinesOnMap = () => {
  const elements = document.querySelectorAll(".element");
  let minesAmount = 0;
  for (let i = 0; i < xSize * ySize; i++) {
    minesAmount += elements[i].classList.contains("cellMine") ? 1 : 0;
  }
  console.log(minesAmount);
  return minesAmount;
};

const updateMinesAmount = () => {
  document.getElementById("minesAmount").innerText = countMinesOnMap();
};

const setMinesAmountInsideDiv = (currentDiv, minesAmount) => {
  const minesAmountParagraph = document.createElement("p");
  minesAmountParagraph.textContent = minesAmount;
  currentDiv.appendChild(minesAmountParagraph);
};

const openAllEmptyCells = (elements, currentNumber) => {
  let currentElement = elements[currentNumber];
  let minesAmount = countSurrounding(elements, currentNumber);
  if (isNotOpen(elements, currentNumber)) {
    openCell(currentElement, minesAmount);
  }
  if (minesAmount != 0) {
    return;
  }

  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      if (x === 0 && y === 0) {
        continue;
      }
      cellId = Number(currentNumber) + x + y * 10;
      if (
        cellId < ySize * xSize &&
        cellId >= 0 &&
        !isInvalidCell(currentNumber, cellId) &&
        isNotOpen(elements, cellId) &&
        !isMine(elements, cellId)
      ) {
        openAllEmptyCells(elements, cellId);
      }
    }
  }
};

const updateCellOnMap = (currentDiv) => {
  const elements = document.querySelectorAll(".element");
  const currentNumber = currentDiv.classList[1];
  const minesAmount = countSurrounding(elements, currentNumber);

  if (minesAmount == 0) {
    openAllEmptyCells(elements, currentNumber);
  }
  setMinesAmountInsideDiv(currentDiv, minesAmount);
};

const isGameEnded = () => {
  if (countMinesOnMap() == 0) {
    document.getElementById("gameState").innerText = "The game has ended";
  }
};

const handleClick = (event) => {
  const currentDiv = event.target;
  currentDiv.classList.replace("cell", "freeCell");
  updateCellOnMap(currentDiv);
  currentDiv.removeEventListener("click", handleClick);
  countMinesOnMap();
  updateMinesAmount();
  clickAmount++;
  isGameEnded();
};

const handleClickMine = (event) => {
  const currentDiv = event.target;
  if (clickAmount === 0) {
    currentDiv.classList.replace("cellMine", "freeCell");
    updateCellOnMap(currentDiv);
  } else {
    currentDiv.classList.replace("cellMine", "mine");
  }
  clickAmount++;
  currentDiv.removeEventListener("click", handleClickMine);
  updateMinesAmount();
  isGameEnded();
};

let clickAmount = 0;
const grid = document.querySelector(".grid-container");

for (let i = 0; i < ySize * xSize; i++) {
  const cell = document.createElement("div");
  cell.classList.add("element", i);
  const isMineTrigger = Math.floor(Math.random() * 10) == 4;
  if (isMineTrigger) {
    cell.classList.add("cellMine");
    cell.addEventListener("click", handleClickMine);
  } else {
    cell.classList.add("cell");
    cell.addEventListener("click", handleClick);
  }

  grid.appendChild(cell);
}

updateMinesAmount();
