import React, {FC, useState, ReactNode, useEffect, MouseEvent} from 'react';
import './App.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells, openMultipleCells } from '../../utils';
import Button from '../Button';
import { Face, Cell, CellState, CellValue } from '../../types';
import { NUMBER_OF_BOMBS_EASY, MAX_ROWS_EASY, MAX_COLS_EASY } from '../../constants';

const App: FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells);
    const [face, setFace] = useState<Face>(Face.smile);
    const [timer, setTimer] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCount, setBombCount] = useState<number>(NUMBER_OF_BOMBS_EASY);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [win, setWin] = useState<boolean>(false);

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        
        if(!live) {
            setLive(true);
        }

        const currentCell = cells[rowParam][colParam];
        let newCells = cells.slice();

        if(currentCell.state === CellState.FLAGGED || currentCell.state === CellState.VISIBLE){
            return;
        }

        if(currentCell.value === CellValue.BOMB) {
            setGameOver(true);
            newCells[rowParam][colParam].red = true;
            newCells = showAllBombs();
            setCells(newCells);
            return;
        } else if (currentCell.value === CellValue.NONE) {
            newCells = openMultipleCells(cells, rowParam, colParam);
        } else {
            newCells[rowParam][colParam].state = CellState.VISIBLE;
            setCells(newCells);
        }

        //Check to see if you have won
        let safeOpenCellsExist = false;
        for(let row = 0; row < MAX_ROWS_EASY; row++){
            for(let col = 0; col < MAX_COLS_EASY; col++) {
                const currentCell = newCells[row][col];
                if(currentCell.value !== CellValue.BOMB && currentCell.state === CellState.OPEN){
                    safeOpenCellsExist = true;
                    break;
                }
            }
        }

        if(!safeOpenCellsExist) {
            newCells = newCells.map(row => row.map(cell => {
                if(cell.value === CellValue.BOMB) {
                    return {
                        ...cell,
                        state: CellState.FLAGGED,
                    }
                }
                return cell;
            }))
            setWin(true);
        }
        setCells(newCells);
    };

    const handleCellContext = (rowParam: number, colParam: number) => (e: MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();

        if(!live) {
            return;
        }

        const currentCells = cells.slice();
        const currentCell = cells[rowParam][colParam];

        if(currentCell.state === CellState.VISIBLE){
            return;
        } else if (currentCell.state === CellState.OPEN) {
            currentCells[rowParam][colParam].state = CellState.FLAGGED;
            setCells(currentCells);
            setBombCount(bombCount - 1);
        } else {
            currentCells[rowParam][colParam].state = CellState.OPEN;
            setCells(currentCells);
            setBombCount(bombCount + 1);
        }
    };

    const handleFaceClick = (): void => {
        if(!live) {
            setLive(false);
            setTimer(0);
            setCells(generateCells());
            setBombCount(NUMBER_OF_BOMBS_EASY);
            setGameOver(false);
            setWin(false);
        }
    };

    useEffect(() => {

        const handleMouseDownEvent = () => {
            setFace(Face.oh);
        }
        window.addEventListener('mousedown', handleMouseDownEvent);
        const handleMouseUpEvent = () => {
            setFace(Face.smile);
        }
        window.addEventListener('mouseup', handleMouseUpEvent);

        return () => {
            window.removeEventListener('mouseup', handleMouseUpEvent);
            window.removeEventListener('mousedown', handleMouseDownEvent);
        }
    }, []);

    useEffect(() => {
        if(live && timer < 999) {
            const time = setInterval(() => {
                setTimer(timer + 1);
            }, 1000);

            return () => {
                clearInterval(time);
            }
        }
    } ,[live, timer]);

    useEffect(() => {
        if(gameOver) {
            setFace(Face.lost);
            setLive(false);
        }
    }, [gameOver]);

    useEffect(() => {
        if(win) {
            setLive(false);
            setFace(Face.win);
        }
    }, [win]);

    const renderCells = ():ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) => (
            <Button 
            key={`${rowIndex}-${colIndex}`}
            state={cell.state} value={cell.value}
            row={rowIndex}
            col={colIndex}
            red={cell.red}
            onClick={handleCellClick}
            onContextClick = {handleCellContext}/>
          ))
        );
    };

    const showAllBombs = (): Cell[][]=> {
        const currentCells = cells.slice();
        return currentCells.map(row => row.map(cell => {
            if (cell.value === CellValue.BOMB) {
                return {
                    ...cell,
                    state: CellState.VISIBLE,
                }
            }
            return cell;
        }))
    };

    return (
        <div className="App">
            <div className="Header">
            <NumberDisplay value={bombCount}/>
            <div className="Face" onClick={handleFaceClick}>
                <span role="img" aria-label="face">{face}</span>
                </div>
            <NumberDisplay value={timer}/>
            </div>
            <div className="Body">
                {renderCells()}
            </div>
        </div>
    )
}

export default App;