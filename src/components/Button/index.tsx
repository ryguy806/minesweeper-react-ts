import React, {FC, ReactNode} from 'react';
import './Button.scss';
import { CellState, CellValue } from '../../types';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    onClick(rowParam: number, colParam: number): (...args: any[]) => void;
    onContextClick(rowParam: number, colParam: number): (...args: any[]) => void;
  }
  
  const Button: FC<ButtonProps> = ({ row, col, state, value, onClick, onContextClick }) => {
    const renderContent = (): ReactNode => {
      if (state === CellState.VISIBLE) {
        if (value === CellValue.BOMB) {
          return (
            <span role="img" aria-label="bomb">
              💣
            </span>
          );
        } else if (value === CellValue.NONE) {
          return null;
        }
  
        return value;
      } else if (state === CellState.FLAGGED) {
        return (
          <span role="img" aria-label="flag">
            🚩
          </span>
        );
      }
  
      return null;
    };
  
    return (
      <div
        className={`Button ${
          state === CellState.VISIBLE ? "visible" : ""
        } value-${value}`}
        onClick={onClick(row, col)}
        onContextMenu={onContextClick(row, col)}
      >
        {renderContent()}
      </div>
    );
  };

export default Button;