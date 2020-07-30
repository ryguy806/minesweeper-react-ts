export enum CellValue {
    BOMB,
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NONE,
}

export enum CellState {
    FLAGGED,
    VISIBLE,
    OPEN,
}

export type Cell = {value: CellValue, state: CellState};

export enum Face {
    smile = '😃',
    oh = '😱',
    lost = '☠️',
    win = '🤩',
}