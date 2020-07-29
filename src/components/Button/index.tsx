import React, {FC, ReactNode} from 'react';
import './Button.scss';
import { CellState, CellValue } from '../../types';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
  }
  
  const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => {
    const renderContent = (): React.ReactNode => {
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
      >
        {renderContent()}
      </div>
    );
  };

export default Button;