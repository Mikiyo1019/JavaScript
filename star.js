'use strict';

class Star {
  name = 'star';
  constructor() {
    this.x = Math.floor(Math.random() * canvas.width); //x座標
    this.y = Math.floor((Math.random() * canvas.height) / 2); //y座標
    this.r = Math.floor(Math.random() * 6) + 1; // 半径 = 円の大きさ
    this.angle = Math.floor(Math.random() * 160) + 10; // 角度 360にすると色んな方向に行く!
    this.speed = Math.random() * 5 + 5; // 速度
    this.vx = this.speed * Math.cos((this.angle / 180) * Math.PI); // x方向のスピード
    this.vy = this.speed * Math.sin((this.angle / 180) * Math.PI); // y方向のスピード
    this.alive = true; // 星の消滅可否 main.jsでfalseにしてインスタンスをdeleteする(クラス内でインスタンスを消せなかった為)
    this.start_time = new Date().getTime(); // 星が生まれた時の時刻
    this.life_time = Math.random() * 1500; // 星の寿命を設定
  }
  // 描画メソッド(星の形成)
  draw() {
    g.beginPath(); //パスを作る最初の作業は、beginPath()メソッドを呼び出すこと。内部では、パスは図形を一緒に作るサブパス(線、円弧など)のリストとして保存される。このメソッドが呼び出される毎に、リストはリセットされ新しい図形を始めることができる。
    const STAR_COLOR = 'white'; // 星の色
    g.fillStyle = STAR_COLOR; //星の色を白に塗りつぶす
    g.arc(this.x, this.y, this.r, 0, Math.PI * 2, false); // 四角形を円にする(), Math.PI * 1にすると半円になる
    //arcの構文 arc(中心x座標, 中心y座標, 半径, 円弧の開始角, 円弧の終了角, 描画の方向)描画の方向true:反時計回り false:時計回り(デフォルト)
    g.fill(); //星を白に塗りつぶす
  }
  // 移動メソッド
  move() {
    this.x += this.vx;//x方向のスピード + x座標
    this.y += this.vy;
  }
  // 更新処理
  update() {
    this.move();
    this.draw();
    // 消滅判定
    let left_time = new Date().getTime() - this.start_time; // 経過時間
    this.r -= left_time / 1000.0; // 徐々に星を小さくする(星の残像の長さ)
    if (left_time > this.life_time || this.r <= 0.0) {// 寿命または星の半径が0より小さくなったら
      //this.r = 0;
      //left_time = 0;
      this.alive = false; // 消滅させる
    }
  }
}
