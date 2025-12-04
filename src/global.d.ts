export { };

declare global {
    interface Window {
        gameDebug: {
            // Scene Navigation
            startLevel: (levelId?: string) => void;
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
