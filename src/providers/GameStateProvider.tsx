import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useStorage';
import { SavedGame } from '../pages/types';

// Define the context type
type StateContext = {
    gameSave: SavedGame | null;
    setGameSave: React.Dispatch<React.SetStateAction<SavedGame | null>>;
    remove: () => void;
};

// Define props for the provider
type ContextProviderProps = {
    children: ReactNode;
};

// Create the context with an initial empty state
const GameStateContext = createContext<StateContext>({
    gameSave: null,
    setGameSave: () => {},
    remove: () => {},
});

// Custom hook to use the context
export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};

// Provider component
export const GameStateProvider = ({ children }: ContextProviderProps) => {
    const [gameState, setGameState, remove] = useLocalStorage<SavedGame | null>('gameState', null);

    const value: StateContext = {
        gameSave: gameState,
        setGameSave: setGameState,
        remove,
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
};
