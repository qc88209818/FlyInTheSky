var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (conttext) {
            conttext.onUpdate = function () {
                console.log('Start Game2!');
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
            console.log('Game2 onPause!');
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
            console.log('Game2 onResume!');
        };
        this.createGameScene();
    };
    Main.prototype.createGameScene = function () {
        console.log("createGameScene width: " + this.stage.stageWidth);
        console.log("createGameScene height: " + this.stage.stageHeight);
        var bg = this.drawRect(0x000000, 0, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.addChild(bg);
        this._circle = this.drawCircle(0xFF0000, 0, 0, 100);
        this.addChild(this._circle);
        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        bg.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        bg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    };
    Main.prototype.onTouchBegin = function (event) {
        if (this._circle != null) {
            this._circle.x = event.stageX;
            this._circle.y = event.stageY;
        }
        console.log();
    };
    Main.prototype.onTouchEnd = function (event) {
    };
    Main.prototype.onTouchMove = function (event) {
    };
    Main.prototype.onTouchTap = function (event) {
    };
    Main.prototype.drawRect = function (color, x, y, width, height) {
        var sprite = new egret.Shape();
        sprite.graphics.beginFill(color, 1);
        sprite.graphics.drawRect(x, y, width, height);
        sprite.graphics.endFill();
        return sprite;
    };
    Main.prototype.drawCircle = function (color, x, y, radius) {
        var sprite = new egret.Shape();
        sprite.graphics.beginFill(color, 1);
        sprite.graphics.drawCircle(x, y, radius);
        sprite.graphics.endFill();
        return sprite;
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map