const xSize = 10;
const ySize = 10;

const MINE_PROBABILITY = 0.1;

let clickAmount = 0;
let isMineClick = false;

const init = () => {
  const grid = document.querySelector(".grid-container");

  for (let i = 0; i < ySize * xSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("element", i);
    const isMineTrigger = Math.random() < MINE_PROBABILITY;
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
};

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

const countSurrounding = (elements, currentNumber) => {
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
        minesAmount += isMineElemnt(currentElement) ? 1 : 0;
      }
    }
  }
  return minesAmount;
};
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

const isMineElemnt = (element) => {
  return (
    element.classList.contains("cellMine") ||
    element.classList.contains("mine") ||
    element.classList.contains("possibleMine")
  );
};

const countMinesOnMap = () => {
  const elements = document.querySelectorAll(".element");
  let minesAmount = 0;
  for (let i = 0; i < xSize * ySize; i++) {
    minesAmount += isMineElemnt(elements[i]) ? 1 : 0;
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
  console.log(elements[currentNumber]);
  elements[currentNumber].innerText = " ";
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
  if (isMineClick) {
    return;
  }
  const elements = document.querySelectorAll(".element");
  const currentNumber = currentDiv.classList[1];
  const minesAmount = countSurrounding(elements, currentNumber);

  if (minesAmount == 0) {
    openAllEmptyCells(elements, currentNumber);
  } else {
    setMinesAmountInsideDiv(currentDiv, minesAmount);
  }
};

const endGame = (isSuccess) => {
  document.getElementById("gameState").innerText = isSuccess
    ? "The game has ended successfuly"
    : "Meh Try again";

  document
    .querySelectorAll(".cell")
    .forEach((currentDiv) =>
      currentDiv.removeEventListener("click", handleClick),
    );
  document
    .querySelectorAll(".cellMine")
    .forEach((currentDiv) =>
      currentDiv.removeEventListener("click", handleClickMine),
    );
  document.getElementById("isMineClick").removeEventListener("click", endGame);
};

const isGameEnded = () => {
  if (countMinesOnMap() == 0) {
    endGame(true);
  }
};

document.getElementById("isMineClick").checked = false;
document.getElementById("isMineClick").onclick = () => {
  isMineClick = !isMineClick;
  console.log("I was here ");
};

const handleClick = (event) => {
  const currentDiv = event.target;

  if (isMineClick) {
    currentDiv.classList.replace("cell", "freeCell");
    endGame(false);
  } else {
    currentDiv.classList.replace("cell", "freeCell");
  }

  updateCellOnMap(currentDiv);
  currentDiv.removeEventListener("click", handleClick);
  countMinesOnMap();
  updateMinesAmount();
  clickAmount++;
  isGameEnded();
};

const handleClickMine = (event) => {
  const currentDiv = event.target;

  // Determine the new class based on the conditions
  let newClass;
  if (isMineClick) {
    newClass = "possibleMine";
  } else {
    if (clickAmount === 0) {
      newClass = "freeCell";
    } else {
      newClass = "mine";
      endGame(false);
    }
  }

  // Replace the class only if necessary
  if (newClass !== currentDiv.className) {
    currentDiv.classList.replace("cellMine", newClass);
    updateCellOnMap(currentDiv);
  }

  clickAmount++;
  currentDiv.removeEventListener("click", handleClickMine);
  updateMinesAmount();
  isGameEnded();
};

init();
