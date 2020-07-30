import React, {FC, useState, ReactNode, useEffect, MouseEvent} from 'react';
import './App.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells } from '../../utils';
import Button from '../Button';
import { Face, Cell, CellState } from '../../types';
import { NUMBER_OF_BOMBS_EASY } from '../../constants';

const App: FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells);
    const [face, setFace] = useState<Face>(Face.smile);
    const [timer, setTimer] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCount, setBombCount] = useState<number>(NUMBER_OF_BOMBS_EASY);

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        
        if(!live) {
            setLive(true);
        }
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
        if(live) {
            setLive(false);
            setTimer(0);
            setCells(generateCells());
            setBombCount(NUMBER_OF_BOMBS_EASY);
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

    const renderCells = ():ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) => (
            <Button 
            key={`${rowIndex}-${colIndex}`}
            state={cell.state} value={cell.value}
            row={rowIndex}
            col={colIndex}
            onClick={handleCellClick}
            onContextClick = {handleCellContext}/>
          ))
        );
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