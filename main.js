'use strict';

/*
 * グローバル変数
 */
let wrapper = null; // キャンバスの親要素
let canvas = null; // キャンバス
let g = null; // 描画コンテキスト globalAlphaのg

let stars = []; // 流れ星を格納するオブジェクト配列

/*
 * キャンバスのサイズをウインドウに合わせて変更
 */

function getSize() { // キャンバスのサイズを再設定
  canvas.width = wrapper.offsetWidth; //wrapperに指定した要素の幅を返すプロパティ offsetWidth = width + padding + border
  canvas.height = wrapper.offsetHeight;
}

/*
 * リサイズ時(ウィンドウサイズが変更された時)
 */

window.addEventListener("resize", function () {
  getSize();
});
/*
 * 流れ星を生成する
 */
function make_star() {
  let star = new Star();
  stars.push(star);
}

/*
 * ゲームループ
 */
const BACKGROUND_COLOR = "rgb(0, 0, 0)";
// ループの回数を制限する
let nuk_count = 0;     // 流れ星のカウンタ
const MAX_COUNT = Math.floor(Math.random() * 7) + 20;  // 流れ星の数 20~26個ランダムに
let requestId = 0;  // requestAnimationFrameの戻値
let end_count = 50; // 終了処理。描きかけの星を消去する。update()の回数

function gameLoop() {
  // たまに流れ星を生成
  if (nuk_count < MAX_COUNT) {
    if (Math.floor(Math.random() * 100) == 1) {
      // いつまでも残っている残像を消すため,this.life_time(星の寿命)
      nuk_count += 1;
      make_star(); // 流れ星を生成
      console.log('nuk_count', nuk_count);
    }
  }

  // i -- stars のプロパティ
  for (let i in stars) {
    stars[i].update(); // 星の寿命チェック
    if (stars[i].alive == false) {
      // オブジェクトは削除していない
      delete stars[i]; // プロパティの削除 stars[i]はオブジェクトのデータまで削除しているのでは・・?stars.iだったらプロパティだけなのはわかるけど・・（for in文）
    }
  }

  // 半透明の背景色で画面クリア（残像のようにみせるため）
  g.globalAlpha = 0.1; //残像部分、直前に描画した星が少し透明がかって残像のように見える
  g.fillStyle = BACKGROUND_COLOR; //↓下とセット
  g.fillRect(0, 0, canvas.width, canvas.height); //星の軌跡をBACKGROUND_COLORに塗り潰す
  g.globalAlpha = 1; // 元に戻して円を描画(最後の方でまたはっきり見えるようになる)

  // 描きかけの星は update()を使って寿命を全うさせなければならない
  if (nuk_count >= MAX_COUNT) {
    end_count -= 1;
  }
  // end_countが50マイナスしたら、アニメーションを止める
  if (end_count < 0) {
    console.log('END', requestId);
    console.log('流れ星の数', nuk_count);
    cancelAnimationFrame(requestId);
    //終了後、finishedを表示する
    drawTtext();
    //2秒後に画面下半分にスクロールする
    setTimeout(scroll, 1500);
  }
  // gameLoopを再帰：「ゲームループ」と呼ばれる一定間隔で描画の更新を行う処理
  else {
    requestId = requestAnimationFrame(gameLoop);
  }
}
/**
 * timeoutをcanvasに表示する
 */
function drawTtext(canvas_id, text_id) {
  //DOM取得
  let canvas = document.getElementById('canvas');
  let g = canvas.getContext('2d');
  let text = document.getElementById('canvas_text');//textのvalueを取得、表示
  //文字のスタイルを指定
  g.font = '90px serif';
  g.fillStyle = '#fff';
  //文字の配置を指定
  g.textBaseline = 'center';
  g.textAlign = 'center';
  //座標を指定（画像の中心に設定）
  let x = (canvas.width / 2);
  let y = (canvas.height / 2);
  g.fillText(text.value, x, y);
}
/**
 * 画面下半分にスクロールする
 */
function scroll() {
  scrollTo({
    top: 500,
    left: 0,
    behavior: "smooth"
  })
}
/**
 * 星の個数を判定する
 * @param: answer 入力された数
 * @return: 判定結果
 */
function judge(answer) {
  if (answer == MAX_COUNT) {
    return '大正解!!沢山願いが叶うでしょう★';
  } else if (answer < MAX_COUNT) {
    return '惜しい!もう少しあるよ!また挑戦してね!';
  } else if (answer > MAX_COUNT) {
    return '惜しい!少し多いかな!また挑戦してね!';
  } else {
    return '数字を入力してね!'
  }
}

/*
 * スタートボタンクリック時の処理
 */
document.getElementById('btn').addEventListener('click', function () {
  // キャンバスの親要素情報取得（親要素が無いとキャンバスのサイズが画面いっぱいに表示できないため）
  //キャンバスに短形を描く関数
  //描画コンテキストの取得
  wrapper = document.getElementById('wrapper');
  // キャンバス情報取得
  canvas = document.getElementById('canvas');
  g = canvas.getContext('2d'); //canvasはgetContextメソッドを持つ。2Dグラフィックを描画するためのメソッドやプロパティを持つオブジェクトを,返す(star.jsのdraw()内)
  // キャンバスをウインドウサイズにする
  getSize();
  // ループに関する変数の初期化
  nuk_count = 0; // 流れ星のカウンタ
  requestId = 0; // requestAnimationFrameの戻値
  end_count = 50; // 終了処理。描きかけの星を消去する。update()の回数
  // ゲームループスタート
  gameLoop();
  //console.log('check');ok
  // nukGameRoop();
});
/**
 * 決定ボタンクリック時の判定
 */
document.getElementById('decideBtn').onclick = function () {
  const number = document.getElementById('text').value;
  document.getElementById('result').textContent = judge(number);
}
/**
 * againボタンクリック時の処理
 */
document.getElementById('againBtn').onclick = function () {
  // 上にスクロールしてから再読み込み
  scrollTo(0, 0);
  location.reload();
  const text = document.getElementById('text').value;
  text = "";
}

