# プロジェクト構成・ツールチェーン仕様

## ツール・技術スタック（抽象）

- 言語：
  - TypeScript（ES Modules 前提）
- パッケージマネージャー：
  - pnpm
- ゲームエンジン：
  - Phaser v3.80+
- ビルドツール：
  - Vite
- テスト：
  - Vitest


理由：
- TypeScript によって型安全性と AI コーディング時の補完を得るため。
- Phaser によって描画・入力・アセットロードまわりの定型処理を減らすため。

## ディレクトリ構成（案）

※ここでは構造のみ記載し、具体的なコードは書かない。

- ルート
  - `AGENTS.md`
  - `package.json`
  - `tsconfig.json`
  - ビルド設定ファイル（例：`vite.config.*`）※TBD
- `src/`
  - `core/`：ゲームロジック（Phaser 非依存）
  - `engine/`：Phaser アダプタ（描画・入力・シーン）
  - `levels/`：各ステージの TS 定義
  - `ui/`：UI レイアウト／HUD 実装（Phaser 上）
  - `app/`：エントリポイント・シーン登録など
- `public/`
  - `assets/`
    - `game/`：ゲームで実際に使用する整形済みアセット
      - `tiles/`
      - `characters/`
      - `ui/`
      - `audio/`
- `assets/`
  - `ai_raw/`：AI 生成素材・元画像（トリミング前の置き場）
    - `tiles/`
    - `characters/`
    - `ui/`
    - `audio/`
- `docs/`
  - 仕様書群（このファイルを含む）

理由：
- `core` を Phaser 非依存に分離することで、テストやロジック変更をしやすくするため。
- `assets/ai_raw` と `public/assets/game` を分けることで、
  生成物と実利用素材を混同せずに管理するため。
- `docs` 配下に仕様をまとめ、AGENTS.md から入口を一本化するため。
