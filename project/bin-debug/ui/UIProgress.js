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
    var UIProgress = (function (_super) {
        __extends(UIProgress, _super);
        function UIProgress() {
            var _this = _super.call(this) || this;
            _this.basescale = 0.5;
            return _this;
        }
        UIProgress.prototype.create = function (max, min, now) {
            var bg = fly.FlyTools.createBitmapByName("hp_bg_png");
            bg.anchorOffsetX = 0;
            bg.anchorOffsetY = bg.height / 2;
            bg.scaleX = this.basescale;
            this.addChild(bg);
            this.bg = bg;
            var fr = fly.FlyTools.createBitmapByName("hp_png");
            fr.anchorOffsetX = 0;
            fr.anchorOffsetY = fr.height / 2;
            fr.scaleX = this.basescale;
            this.addChild(fr);
            this.fr = fr;
            this.max = max;
            this.min = min;
            this.now = now;
            this.changeValue(now);
        };
        UIProgress.prototype.setPosition = function (x, y) {
            this.bg.x = -this.bg.width / 2 * this.basescale + x;
            this.bg.y = y;
            this.fr.x = -this.fr.width / 2 * this.basescale + x;
            this.fr.y = y;
        };
        UIProgress.prototype.changeValue = function (value) {
            var v = value;
            v = Math.min(this.max, v);
            v = Math.max(this.min, v);
            this.now = v;
            var scale = (v - this.min) / (this.max - this.min);
            this.fr.scaleX = this.basescale * scale;
        };
        return UIProgress;
    }(egret.DisplayObjectContainer));
    fly.UIProgress = UIProgress;
    __reflect(UIProgress.prototype, "fly.UIProgress");
})(fly || (fly = {}));
//# sourceMappingURL=UIProgress.js.map