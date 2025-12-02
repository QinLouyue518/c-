import React, { useState, useEffect } from 'react';
import { GridState } from '../types';

interface GridVisualizerProps {
  initialGrid: GridState;
  onGridChange?: (newGrid: GridState) => void;
  showSimulation?: boolean;
}

const COLORS = [
  'bg-gray-100 text-gray-400', // 0 (Eliminated)
  'bg-red-100 text-red-700 border-red-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-teal-100 text-teal-700 border-teal-200',
];

export const GridVisualizer: React.FC<GridVisualizerProps> = ({ initialGrid, onGridChange, showSimulation }) => {
  const [grid, setGrid] = useState<number[][]>(initialGrid.data);
  const [markedCells, setMarkedCells] = useState<Set<string>>(new Set());
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setGrid(initialGrid.data);
    setMarkedCells(new Set());
  }, [initialGrid]);

  const handleCellChange = (r: number, c: number, val: string) => {
    if (showSimulation) return; // Read-only during simulation mode context
    
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1 || num > 9) return;

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
    if (onGridChange) {
      onGridChange({ ...initialGrid, data: newGrid });
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    const rows = grid.length;
    const cols = grid[0].length;
    const toRemove = new Set<string>();

    // Horizontal check
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j <= cols - 3; j++) {
        if (grid[i][j] !== 0 && grid[i][j] === grid[i][j+1] && grid[i][j] === grid[i][j+2]) {
          // Look ahead for more than 3
          let k = 0;
          while (j + k < cols && grid[i][j+k] === grid[i][j]) {
            toRemove.add(`${i},${j+k}`);
            k++;
          }
        }
      }
    }

    // Vertical check
    for (let j = 0; j < cols; j++) {
      for (let i = 0; i <= rows - 3; i++) {
        if (grid[i][j] !== 0 && grid[i][j] === grid[i+1][j] && grid[i][j] === grid[i+2][j]) {
           let k = 0;
           while (i + k < rows && grid[i+k][j] === grid[i][j]) {
             toRemove.add(`${i+k},${j}`);
             k++;
           }
        }
      }
    }

    setMarkedCells(toRemove);

    setTimeout(() => {
      const finalGrid = grid.map((row, r) => row.map((val, c) => {
        return toRemove.has(`${r},${c}`) ? 0 : val;
      }));
      setGrid(finalGrid);
      setMarkedCells(new Set());
      setIsSimulating(false);
    }, 2000);
  };

  const resetGrid = () => {
    setGrid(initialGrid.data);
    setMarkedCells(new Set());
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="grid gap-2 p-4 bg-white rounded-xl shadow-sm border border-slate-200"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isMarked = markedCells.has(`${rowIndex},${colIndex}`);
            const colorClass = cell === 0 ? COLORS[0] : COLORS[cell % COLORS.length];
            
            return (
              <div key={`${rowIndex}-${colIndex}`} className="relative group">
                <input
                  type="text"
                  value={cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  disabled={isSimulating}
                  className={`
                    w-12 h-12 text-center text-xl font-bold rounded-lg transition-all duration-300
                    ${colorClass}
                    ${isMarked ? 'ring-4 ring-red-500 scale-110 z-10' : 'border'}
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                  `}
                />
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-red-600 text-3xl font-black opacity-50">X</span>
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>

      {showSimulation && (
        <div className="flex space-x-3">
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors shadow-sm"
          >
            {isSimulating ? '处理中...' : '模拟消除'}
          </button>
          <button 
            onClick={resetGrid}
            disabled={isSimulating}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 font-medium transition-colors"
          >
            重置
          </button>
        </div>
      )}
    </div>
  );
};