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
var fly;
(function (fly) {
    var EnterGameScene = (function (_super) {
        __extends(EnterGameScene, _super);
        function EnterGameScene() {
            var _this = _super.call(this) || this;
            _this.music = new fly.FlyMusic();
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeStage, _this);
            return _this;
        }
        EnterGameScene.prototype.onAddToStage = function () {
            this.music.playObject("start.mp3");
            this.graphics.beginFill(0x000000, 0);
            this.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
            this.graphics.endFill();
            var width = this.stage.stageWidth;
            var height = this.stage.stageHeight;
            var title_bg = new egret.Bitmap();
            title_bg.texture = RES.getRes("title_png");
            title_bg.anchorOffsetX = title_bg.width / 2;
            title_bg.anchorOffsetY = title_bg.height / 2;
            title_bg.x = width / 2;
            title_bg.y = 170;
            title_bg.scaleX = title_bg.scaleY = 2;
            this.addChild(title_bg);
            this.title_bg = title_bg;
            // 过场动画
            var png = new egret.MovieClip(fly.ObjectManager.inst().winFactory.generateMovieClipData("Win"));
            png.gotoAndPlay("play", -1);
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.x = width / 2 - 10;
            png.y = height / 2 - 270;
            png.scaleX = png.scaleY = 2;
            this.addChild(png);
            // 开始按钮
            var enterGameBtn = fly.FlyTools.createBitmapByName("playBtn_png");
            enterGameBtn.anchorOffsetX = enterGameBtn.width / 2;
            enterGameBtn.anchorOffsetY = enterGameBtn.height / 2;
            enterGameBtn.x = width / 2;
            enterGameBtn.y = png.y + png.height * 2 + 150;
            enterGameBtn.scaleX = enterGameBtn.scaleY = 2;
            this.addChild(enterGameBtn);
            this.enterGameBtn = enterGameBtn;
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchClick, this);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCancel, this);
        };
        EnterGameScene.prototype.removeStage = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeStage, this);
        };
        EnterGameScene.prototype.onTouchBegin = function (evt) {
            if (this.enterGameBtn.hitTestPoint(evt.localX, evt.localY)) {
                this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 1.8;
            }
        };
        EnterGameScene.prototype.onTouchClick = function (evt) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            if (this.enterGameBtn.hitTestPoint(evt.localX, evt.localY)) {
                this.music.stop();
                var parent_1 = this.parent;
                parent_1.removeChild(this);
                var mgr = fly.SceneManager.inst();
                mgr.init(parent_1, parent_1.stage.stageWidth, parent_1.stage.stageHeight);
                mgr.load(1);
            }
        };
        EnterGameScene.prototype.onTouchCancel = function (evt) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
        };
        return EnterGameScene;
    }(egret.Sprite));
    fly.EnterGameScene = EnterGameScene;
    __reflect(EnterGameScene.prototype, "fly.EnterGameScene");
})(fly || (fly = {}));
//# sourceMappingURL=EnterGameScene.js.map