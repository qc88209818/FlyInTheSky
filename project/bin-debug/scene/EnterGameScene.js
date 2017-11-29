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
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeStage, _this);
            return _this;
        }
        EnterGameScene.prototype.onAddToStage = function () {
            this.graphics.beginFill(0x000000, 0);
            this.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
            this.graphics.endFill();
            this.title_bg = new egret.Bitmap();
            this.title_bg.texture = RES.getRes("title_png");
            this.title_bg.anchorOffsetX = this.title_bg.width / 2;
            this.title_bg.anchorOffsetY = this.title_bg.height / 2;
            this.title_bg.x = this.stage.stageWidth / 2;
            this.title_bg.y = 170;
            this.title_bg.scaleX = this.title_bg.scaleY = 2;
            this.addChild(this.title_bg);
            this.enterGameBtn = new egret.Bitmap();
            this.enterGameBtn.texture = RES.getRes("playBtn_png");
            this.enterGameBtn.anchorOffsetX = this.enterGameBtn.width / 2;
            this.enterGameBtn.anchorOffsetY = this.enterGameBtn.height / 2;
            this.enterGameBtn.x = this.stage.stageWidth / 2;
            this.enterGameBtn.y = this.stage.stageHeight / 2 - 70;
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            this.addChild(this.enterGameBtn);
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
            console.log("" + this.enterGameBtn.scaleX);
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            if (this.enterGameBtn.hitTestPoint(evt.localX, evt.localY)) {
                var parent_1 = this.parent;
                parent_1.removeChild(this);
                var mgr = fly.SceneManager.inst();
                mgr.init(parent_1, parent_1.stage.stageWidth, parent_1.stage.stageHeight);
                mgr.load(1);
            }
        };
        EnterGameScene.prototype.onTouchCancel = function (evt) {
            console.log("" + this.enterGameBtn.scaleX);
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
        };
        return EnterGameScene;
    }(egret.Sprite));
    fly.EnterGameScene = EnterGameScene;
    __reflect(EnterGameScene.prototype, "fly.EnterGameScene");
})(fly || (fly = {}));
