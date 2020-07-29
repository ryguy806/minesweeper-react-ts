import { MAX_ROWS_EASY, MAX_COLS_EASY } from "../constants";
import { CellValue, CellState, Cell } from "../types";

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];
  
    for (let row = 0; row < MAX_ROWS_EASY; row++) {
      cells.push([]);
      for (let col = 0; col < MAX_COLS_EASY; col++) {
        cells[row].push({
          value: CellValue.NONE,
          state: CellState.OPEN,
        });
      }
    }
    return cells;
}