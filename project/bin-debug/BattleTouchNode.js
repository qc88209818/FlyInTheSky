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
    var BattleTouchNode = (function (_super) {
        __extends(BattleTouchNode, _super);
        function BattleTouchNode(parentNode, maxDist) {
            var _this = _super.call(this) || this;
            _this.direct = [];
            _this.isTouchMove = false;
            _this.parentNode = parentNode;
            _this.maxDist = maxDist;
            _this.createTouchLayer();
            return _this;
        }
        BattleTouchNode.prototype.createTouchLayer = function () {
            var background = new egret.Shape();
            background.graphics.beginFill(0x555555, 1);
            background.graphics.drawRect(0, 0, fly.FlyConfig.stageWidth, fly.FlyConfig.stageHeight);
            background.graphics.endFill();
            this.parentNode.addChildAt(background, 0);
            background.touchEnabled = true;
            background.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            background.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            background.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            background.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEnd, this);
            background.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
            var bg = fly.FlyTools.createBitmapByName("virtual_background_png");
            bg.alpha = 0;
            bg.scaleX = 0.5;
            bg.scaleY = 0.5;
            bg.anchorOffsetX = bg.width / 2;
            bg.anchorOffsetY = bg.height / 2;
            this.virtualBg = bg;
            this.parentNode.addChildAt(bg, 100);
            var btn = fly.FlyTools.createBitmapByName("virtual_button_png");
            btn.alpha = 0;
            btn.scaleX = 0.5;
            btn.scaleY = 0.5;
            btn.anchorOffsetX = btn.width / 2;
            btn.anchorOffsetY = btn.height / 2;
            this.virtualBtn = btn;
            this.parentNode.addChildAt(btn, 101);
        };
        BattleTouchNode.prototype.onTouchBegin = function (evt) {
            this.virtualBg.x = evt.stageX;
            this.virtualBg.y = evt.stageY;
            this.virtualBg.alpha = 0.5;
            this.virtualBtn.x = evt.stageX;
            this.virtualBtn.y = evt.stageY;
            this.virtualBtn.alpha = 0.5;
        };
        BattleTouchNode.prototype.onTouchEnd = function (evt) {
            this.virtualBg.alpha = 0;
            this.virtualBtn.alpha = 0;
            this.isTouchMove = false;
        };
        BattleTouchNode.prototype.onTouchMove = function (evt) {
            var from = [this.virtualBg.x, this.virtualBg.y];
            var to = [evt.stageX, evt.stageY];
            var direct = [(to[0] - from[0]), (to[1] - from[1])];
            var normal = [];
            p2.vec2.normalize(normal, direct);
            var dist = p2.vec2.distance(to, from);
            if (dist > this.maxDist) {
                dist = this.maxDist;
            }
            this.direct[0] = normal[0] * dist;
            this.direct[1] = normal[1] * dist;
            this.virtualBtn.x = from[0] + this.direct[0];
            this.virtualBtn.y = from[1] + this.direct[1];
            this.isTouchMove = true;
        };
        return BattleTouchNode;
    }(egret.DisplayObjectContainer));
    fly.BattleTouchNode = BattleTouchNode;
    __reflect(BattleTouchNode.prototype, "fly.BattleTouchNode");
})(fly || (fly = {}));
//# sourceMappingURL=BattleTouchNode.js.map