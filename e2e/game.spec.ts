import { expect, test } from '@playwright/test';

interface GameDebug {
    getCurrentScene: () => string;
}

declare global {
    interface Window {
        gameDebug?: GameDebug;
    }
}

test('Game Flow: Title -> Level Select -> Game', async ({ page }) => {
    // 1. Go to home page
    await page.goto('/');

    // 2. Wait for Title Scene (canvas to be ready)
    await page.waitForSelector('canvas');

    // Wait a bit for the scene to fully load/fade in
    await page.waitForTimeout(2000);

    // Debug: Check if gameDebug exists and what scene we are in
    const initialScene = await page.evaluate(() =>
        window.gameDebug?.getCurrentScene(),
    );
    console.log('Initial Scene:', initialScene);
    expect(initialScene).toBe('TitleScene');

    // 3. Click anywhere to start
    await page.click('canvas', { position: { x: 426, y: 250 } }); // Center of 853x500

    // 4. Wait for Level Select Scene
    await page.waitForTimeout(2000);

    // Verify we are in Level Select Scene using debug API
    const sceneName = await page.evaluate(() =>
        window.gameDebug?.getCurrentScene(),
    );
    console.log('Scene after click:', sceneName);
    expect(sceneName).toBe('LevelSelectScene');

    // Debug: Log canvas bounding box
    const canvasBox = await page.locator('canvas').boundingBox();
    console.log('Canvas Box:', canvasBox);

    // Debug: Screenshot
    await page.screenshot({ path: 'e2e/debug-level-select.png' });

    // 5. Click Level 1
    // If canvas is resized, we need to click relative to it.
    // If canvasBox is { x: 93, y: 0, width: 667, height: 500 }
    // Button is at 200/800 * width, 250/600 * height?
    // No, 200/800 * 667 = 166.75.
    // 250/600 * 500 = 208.33.
    // So click at (canvasBox.x + 167, canvasBox.y + 208).

    if (canvasBox) {
        const clickX = canvasBox.x + (200 / 800) * canvasBox.width;
        const clickY = canvasBox.y + (250 / 600) * canvasBox.height;
        console.log(`Clicking at: ${clickX}, ${clickY}`);
        await page.mouse.click(clickX, clickY);
    }

    // 6. Wait for Game Scene
    await page.waitForTimeout(2000);

    // Verify we are in Game Scene
    const gameSceneName = await page.evaluate(() =>
        window.gameDebug?.getCurrentScene(),
    );
    console.log('Scene after level select:', gameSceneName);
    expect(gameSceneName).toBe('GameScene');
});
