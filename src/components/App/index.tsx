import React, {FC, useState, ReactNode} from 'react';
import './App.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells } from '../../utils';
import Button from '../Button';

const App: FC = () => {
    const [cells, setCells] = useState(generateCells);

    console.log(cells);
    

    const renderCells = ():ReactNode => {
        return cells.map((row, rowIndex) => row.map((col, colIndex) => <Button  key={`${rowIndex} - ${colIndex}`}/>))
    }

    return (
        <div className="App">
            <div className="Header">
            <NumberDisplay value={0}/>
            <div className="Face"> <span role="img" aria-label="face">😃</span></div>
            <NumberDisplay value={23}/>
            </div>
            <div className="Body">
                {renderCells()}
            </div>
        </div>
    )
}

export default App;