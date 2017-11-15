var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var UIProgress = (function () {
        function UIProgress() {
            this.basescale = 2;
        }
        UIProgress.prototype.create = function (parentNode, max, min, now) {
            var bg = fly.FlyTools.createBitmapByName("hp_bg_png");
            bg.anchorOffsetX = 0;
            bg.anchorOffsetY = bg.height / 2;
            bg.scaleX = this.basescale;
            bg.scaleY = this.basescale;
            parentNode.addChild(bg);
            this.bg = bg;
            var fr = fly.FlyTools.createBitmapByName("hp_png");
            fr.anchorOffsetX = 0;
            fr.anchorOffsetY = fr.height / 2;
            fr.scaleX = this.basescale;
            fr.scaleY = this.basescale;
            parentNode.addChild(fr);
            this.fr = fr;
            this.max = max;
            this.min = min;
            this.now = now;
            this.changeValue(now);
        };
        UIProgress.prototype.setPosition = function (x, y) {
            this.bg.x = x;
            this.bg.y = y;
            this.fr.x = x;
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
    }());
    fly.UIProgress = UIProgress;
    __reflect(UIProgress.prototype, "fly.UIProgress");
})(fly || (fly = {}));
//# sourceMappingURL=UIProgress.js.map