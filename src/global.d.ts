export {};

declare global {
    interface Window {
        gameDebug: {
            // Scene Navigation
            startLevel: (levelIndex?: number) => void;
            goToTitle: () => void;
            restartLevel: () => void;

            // Game State Manipulation
            forceGameOver: () => void;
            forceLevelClear: () => void;

            // Info
            getCurrentScene: () => string;
        };
    }
}
