# シーン／状態遷移仕様

## シーン一覧（案）

1. BootScene（起動・アセットプリロード）
2. TitleScene（タイトル）
3. WorldSelectScene（バイオーム選択）
4. LevelSelectScene（レベル選択）
5. GameScene（ゲーム本編）
6. ClearOverlay（クリア UI オーバーレイ）

シーン名は仮称。実際のクラス名・ファイル名は未定。

## 各シーンの役割（抽象）

- BootScene
  - アセットのプリロード。
  - 読み込み完了後、TitleScene へ遷移。
  - 理由：ゲーム開始前にロード中の真っ黒画面を避け、安定した起動を実現するため。

- TitleScene
  - タイトルイラスト＋大きな「スタート」ボタン（テキストなし・アイコンのみ）。
  - タップで WorldSelectScene に進む。
  - 設定（音量 ON/OFF）への入口を持ってもよい（TBD）。

- WorldSelectScene
  - 各バイオームのカードを並べる。
  - 開放済みのバイオームのみ選択可能。
  - 選択されたバイオーム ID を保持して LevelSelectScene に遷移。

- LevelSelectScene
  - 選択されたバイオーム内のステージノードを表示。
  - 次に遊べるステージを強調表示。
  - ステージを選択すると、対応するレベル定義を GameScene へ渡す。

- GameScene
  - core 層のゲーム状態を管理し、毎フレーム更新する。
  - 上部 HUD に UI を表示（詳細は `/docs/ui-layout.md`）。
  - ポーズボタンからオーバーレイメニュー（Resume/Retry/Home）を表示して制御する。

- ClearOverlay
  - ステージクリア時に GameScene の上に乗るオーバーレイ。
  - LevelSelectScene（レベル選択）へ戻るボタンを持つ。
  - 次のレベルは自動解放される。

理由：
- シーンを分割することで、UI や状態遷移の責務を分離し、
  1 シーンあたりの複雑度を抑えるため。
- オーバーレイ（Pause/Clear）として実装することで、
  ゲーム本編の状態を残したまま UI を表示・非表示できるようにするため。
