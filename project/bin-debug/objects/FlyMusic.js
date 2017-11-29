var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var FlyMusic = (function () {
        function FlyMusic() {
            this._sound = new egret.Sound();
            this._forever = false;
        }
        // 加载音乐
        FlyMusic.prototype.loadMusic = function (path, forever) {
            if (forever === void 0) { forever = false; }
            this.stop();
            this._sound.load(path);
            this._sound.addEventListener(egret.Event.COMPLETE, this.onLoad, this);
            this._forever = forever;
        };
        //播放
        FlyMusic.prototype.play = function () {
            //sound 播放会返回一个 SoundChannel 对象，暂停、音量等操作请控制此对象
            this._channel = this._sound.play(0, this._forever ? 0 : 1);
            this._channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);
        };
        //停止
        FlyMusic.prototype.stop = function () {
            if (this._channel) {
                this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);
                this._channel.stop();
                this._channel = null;
            }
        };
        FlyMusic.prototype.onLoad = function () {
            this._sound.removeEventListener(egret.Event.COMPLETE, this.onLoad, this);
            // console.log("播放音乐")
            this.play();
        };
        //播放完成
        FlyMusic.prototype.onComplete = function () {
            // console.log("播放完成")
            this.stop();
        };
        FlyMusic.prototype.playVictory = function () {
            this.loadMusic("resource/music/victory.mp3");
        };
        FlyMusic.prototype.playDefeated = function () {
            this.loadMusic("resource/music/defeated.mp3");
        };
        FlyMusic.prototype.playBgm = function (num) {
            this.loadMusic("resource/music/bgm" + num + ".mp3", true);
        };
        return FlyMusic;
    }());
    fly.FlyMusic = FlyMusic;
    __reflect(FlyMusic.prototype, "fly.FlyMusic");
})(fly || (fly = {}));
//# sourceMappingURL=FlyMusic.js.map