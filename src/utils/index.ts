import { MAX_COLS_EASY, MAX_ROWS_EASY, NUMBER_OF_BOMBS_EASY } from "../constants";
import { Cell, CellState, CellValue } from "../types";

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < MAX_COLS_EASY - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < MAX_COLS_EASY - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS_EASY - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS_EASY - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < MAX_ROWS_EASY - 1 && colParam < MAX_COLS_EASY - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell
  };
};

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  // generating all cells
  for (let row = 0; row < MAX_ROWS_EASY; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS_EASY; col++) {
      cells[row].push({
        value: CellValue.NONE,
        state: CellState.OPEN
      });
    }
  }

  // randomly put 10 bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NUMBER_OF_BOMBS_EASY) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS_EASY);
    const randomCol = Math.floor(Math.random() * MAX_COLS_EASY);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.BOMB) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
              value: CellValue.BOMB
            };
          }

          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  // calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS_EASY; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS_EASY; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.BOMB) {
        continue;
      }

      let numberOfBombs = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
      } = grabAllAdjacentCells(cells, rowIndex, colIndex);

      if (topLeftCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }
      if (topCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }
      if (topRightCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }
      if (leftCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }
      if (rightCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }
      if (bottomLeftCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }
      if (bottomCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }
      if (bottomRightCell?.value === CellValue.BOMB) {
        numberOfBombs++;
      }

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  const currentCell = cells[rowParam][colParam];

  if (
    currentCell.state === CellState.VISIBLE ||
    currentCell.state === CellState.FLAGGED
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][colParam].state = CellState.VISIBLE;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell
  } = grabAllAdjacentCells(cells, rowParam, colParam);

  if (
    topLeftCell?.state === CellState.OPEN &&
    topLeftCell.value !== CellValue.BOMB
  ) {
    if (topLeftCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.VISIBLE;
    }
  }

  if (topCell?.state === CellState.OPEN && topCell.value !== CellValue.BOMB) {
    if (topCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam);
    } else {
      newCells[rowParam - 1][colParam].state = CellState.VISIBLE;
    }
  }

  if (
    topRightCell?.state === CellState.OPEN &&
    topRightCell.value !== CellValue.BOMB
  ) {
    if (topRightCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.VISIBLE;
    }
  }

  if (leftCell?.state === CellState.OPEN && leftCell.value !== CellValue.BOMB) {
    if (leftCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam, colParam - 1);
    } else {
      newCells[rowParam][colParam - 1].state = CellState.VISIBLE;
    }
  }

  if (
    rightCell?.state === CellState.OPEN &&
    rightCell.value !== CellValue.BOMB
  ) {
    if (rightCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam, colParam + 1);
    } else {
      newCells[rowParam][colParam + 1].state = CellState.VISIBLE;
    }
  }

  if (
    bottomLeftCell?.state === CellState.OPEN &&
    bottomLeftCell.value !== CellValue.BOMB
  ) {
    if (bottomLeftCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.VISIBLE;
    }
  }

  if (
    bottomCell?.state === CellState.OPEN &&
    bottomCell.value !== CellValue.BOMB
  ) {
    if (bottomCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam);
    } else {
      newCells[rowParam + 1][colParam].state = CellState.VISIBLE;
    }
  }

  if (
    bottomRightCell?.state === CellState.OPEN &&
    bottomRightCell.value !== CellValue.BOMB
  ) {
    if (bottomRightCell.value === CellValue.NONE) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.VISIBLE;
    }
  }

  return newCells;
};