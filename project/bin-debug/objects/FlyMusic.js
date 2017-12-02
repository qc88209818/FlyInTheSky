var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var FlyMusic = (function () {
        function FlyMusic() {
            this._sound = new egret.Sound();
            this._time = 0;
            this._initFinish = false;
        }
        // 加载音乐
        FlyMusic.prototype.loadMusic = function (path, time) {
            if (time === void 0) { time = 0; }
            this.stop();
            this._initFinish = false;
            this._sound.load(path);
            this._sound.addEventListener(egret.Event.COMPLETE, this.onLoad, this);
            this._time = time;
        };
        FlyMusic.prototype.loadMusicOnly = function (path) {
            this.stop();
            this._initFinish = false;
            this._sound.load(path);
            this._sound.addEventListener(egret.Event.COMPLETE, this.onLoadOnly, this);
        };
        //播放
        FlyMusic.prototype.play = function (time) {
            if (time === void 0) { time = 0; }
            if (!this._initFinish)
                return;
            //sound 播放会返回一个 SoundChannel 对象，暂停、音量等操作请控制此对象
            this._channel = this._sound.play(0, time);
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
            this._initFinish = true;
            this.play(this._time);
        };
        FlyMusic.prototype.onLoadOnly = function () {
            this._sound.removeEventListener(egret.Event.COMPLETE, this.onLoad, this);
            this._initFinish = true;
        };
        //播放完成
        FlyMusic.prototype.onComplete = function () {
            // console.log("播放完成")
            this.stop();
        };
        FlyMusic.prototype.playObject = function (obj, time) {
            if (time === void 0) { time = 0; }
            this.loadMusic("resource/music/" + obj, time);
        };
        FlyMusic.prototype.loadObject = function (obj) {
            this.loadMusicOnly("resource/music/" + obj);
        };
        return FlyMusic;
    }());
    fly.FlyMusic = FlyMusic;
    __reflect(FlyMusic.prototype, "fly.FlyMusic");
})(fly || (fly = {}));
