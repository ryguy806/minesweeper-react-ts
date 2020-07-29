import { MAX_ROWS_EASY, MAX_COLS_EASY, NUMBER_OF_BOMBS_EASY } from "../constants";
import { CellValue, CellState, Cell } from "../types";

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];
  
    for (let row = 0; row < MAX_ROWS_EASY; row++) {
      cells.push([]);
      for (let col = 0; col < MAX_COLS_EASY; col++) {
        cells[row].push({
          value: CellValue.NONE,
          state: CellState.VISIBLE,
        });
      }
    }

    //randomly put 10 bombs.
    let bombsPlace = 0;
    while(bombsPlace < NUMBER_OF_BOMBS_EASY) {
      const randomRow = Math.floor(Math.random() * MAX_ROWS_EASY);
      const randomCol = Math.floor(Math.random() * MAX_COLS_EASY);

      const currentCell = cells[randomRow][randomCol];
      if(currentCell.value !== CellValue.BOMB) {
        cells = cells.map((row, rowIndex) => row.map((cell, colIndex) => {
          if(randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
              value: CellValue.BOMB,
            }
          }

          return cell
        }));
        bombsPlace++;
      } 
    }

    for(let rowIndex = 0; rowIndex < MAX_ROWS_EASY; rowIndex++) {
      for(let colIndex = 0; colIndex < MAX_COLS_EASY; colIndex++) {
        const currentCell = cells[rowIndex][colIndex];
        if(currentCell.value === CellValue.BOMB){
          continue;
        }

        let numberOfBombs = 0;
        const topLeftBomb = rowIndex > 0 && colIndex > 0 ? cells[rowIndex-1][colIndex-1] : null;
        const topBomb = rowIndex > 0 ? cells[rowIndex-1][colIndex] : null;
        const topRightBomb = rowIndex > 0 && colIndex < MAX_COLS_EASY-1 ? cells[rowIndex-1][colIndex+1] : null;
        const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex-1] : null;
        const rightBomb = colIndex < MAX_COLS_EASY-1 ? cells[rowIndex][colIndex+1] : null;
        const bottomLeftBomb = rowIndex < MAX_ROWS_EASY-1 && colIndex > 0 ? cells[rowIndex+1][colIndex-1] : null;
        const bottomBomb = rowIndex < MAX_ROWS_EASY-1  ? cells[rowIndex+1][colIndex] : null;
        const bottomRightBomb = rowIndex < MAX_ROWS_EASY-1 && colIndex < MAX_COLS_EASY-1 ? cells[rowIndex+1][colIndex+1] : null;

        if(topLeftBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }
        if(topBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }
        if(topRightBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }
        if(leftBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }
        if(rightBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }
        if(bottomLeftBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }
        if(bottomBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }
        if(bottomRightBomb?.value === CellValue.BOMB){
          numberOfBombs++;
        }

        if (numberOfBombs > 0) {
          cells[rowIndex][colIndex] = {
            ...currentCell,
            value: numberOfBombs,
          }
        }

      }
    }

    return cells;
}