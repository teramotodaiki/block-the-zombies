# アセット取得ガイド (Asset Acquisition Guide)

本プロジェクトにおける、外部アセット（特に音声素材）の効率的な取得方法をまとめたマニュアルです。
AIエージェントがアセット探索を行う際、ブラウザ操作での探索が非効率になりがちなため、以下の推奨手順に従ってください。

## Minecraft Wiki (Fandom) からの音声一括取得

Minecraft Wiki (Fandom) は構造上、ブラウザでの深い階層の探索や「すべて表示」系のアクションが不安定になりがちです。
特定のファイル名やカテゴリが判明している場合、`curl` と `grep` を組み合わせたスクレイピングが最も高速かつ確実です。

### 基本戦略

1. **ファイルページへのアクセス**:
   音声ファイルは通常 `https://minecraft.fandom.com/wiki/File:Filename.ogg` というURLパターンで管理されています。
2. **直リンクの抽出**:
   ファイルページのHTML内には、`.ogg` ファイルへの直リンク（`static.wikia.nocookie.net` ドメイン）が含まれています。
3. **コマンドラインでのダウンロード**:
   `curl` を使用してページを取得し、grepで `.ogg` リンクを抽出してダウンロードします。

### 実践レシピ (Command Line)

#### 単一ファイルのダウンロード
ファイル名（例: `Grass_dig1.ogg`）が分かっている場合：

```bash
# リンクの抽出 (確認用)
curl -L "https://minecraft.fandom.com/wiki/File:Grass_dig1.ogg" | grep -o 'https://[^"]*\.ogg' | head -n 1

# ダウンロード実行 (workbench/downloads へ保存)
curl -L -o workbench/downloads/Grass_dig1.ogg "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e1/Grass_dig1.ogg"
```

#### カテゴリや記事からの探索
「村人(Villager)」に関連する音を探したい場合、記事ページからリンクを抽出するのが効率的です。

```bash
# Villager記事内の全oggリンクを表示
curl -L "https://minecraft.fandom.com/wiki/Villager" | grep -o 'https://[^"]*\.ogg' | sort | uniq
```

### ファイル形式について (.ogg vs .mp3)

Minecraft Wiki の素材は `.ogg` 形式ですが、iOS (iPhone/iPad) や macOS の Safari など、一部の環境で `.ogg` が再生できない場合があるため、互換性の高い `.mp3` を推奨しています。

## 画像の取得 (Image Acquisition)

音声と同様に、画像ファイルも `curl` と `grep` で取得可能です。
AIによる画像生成の参考資料（リファレンス）を集める際などに役立ちます。

### 実践レシピ

画像ファイルは `File:Filename.png` (または `.jpg`, `.gif`) というページで管理されています。

```bash
# 草ブロック(Grass Block)の画像リンクを抽出
curl -L "https://minecraft.fandom.com/wiki/File:Grass_Block.png" | grep -o 'https://[^"]*\.png' | head -n 1
```
