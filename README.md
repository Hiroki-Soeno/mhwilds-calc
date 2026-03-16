# MHWilds 火力期待値シミュレータ

モンスターハンターワイルズの火力ダメージ計算シミュレータです。

## 機能

- 全14武器種対応
- 巨戟アーティア（激化・生産ボーナス・復元ボーナス5枠）
- アイテムバフ（護符/種/薬/粉塵/食事、グループ重複制御）
- シリーズスキル×2 + グループスキル
- 防具スキル22種（武器種別倍率完全対応）
- 武器固有補正（太刀練気/双剣身躱し/狩猟笛旋律/スラアク斧強化/操虫棍エキス/弓ビン）
- モーション値テーブル（全14武器種、macarongamemo ver1.040準拠）
- 戦闘条件トグル16種

## 使い方

`index.html` をブラウザで開くだけで動作します（サーバー不要）。

## GitHub Pages への公開手順

1. GitHubで新しいリポジトリを作成
2. `index.html` をリポジトリのルートにアップロード
3. Settings → Pages → Source を `main` ブランチの `/ (root)` に設定
4. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開

## データソース

- [macarongamemo](https://macarongamemo.com/) — モーション値・ダメージ計算式
- [game8](https://game8.jp/mhwilds/) — スキル値・アイテムバフ値
- [ゲーアニライフ](https://k-k-kohei.com/) — バフ区分・狩猟笛旋律
- [a-to-monhan](https://a-to-monhan.com/) — 斬れ味補正実機検証
- [たろたろ](https://note.com/tarotaro0_game/) — 太刀TU2検証
- [MH大辞典Wiki](https://wikiwiki.jp/nenaiko/) — 各種検証データ
- [kuroyonhon](https://kuroyonhon.com/) — 連撃武器種別テーブル・双剣データ
