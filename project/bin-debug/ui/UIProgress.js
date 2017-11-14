var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var UIProgress = (function () {
        function UIProgress() {
        }
        UIProgress.prototype.create = function (parentNode, x, y, width, height) {
            var bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, fly.FlyConfig.DebugMode ? 1 : 0);
            bg.graphics.drawRect(0, 0, width, height);
            bg.graphics.endFill();
            this.bg = bg;
            bg.x = x;
            bg.y = y;
            bg.anchorOffsetX = 0;
            bg.anchorOffsetY = 0.5;
            parentNode.addChild(bg);
            var fr = new egret.Shape();
            fr.graphics.beginFill(0x000000, fly.FlyConfig.DebugMode ? 1 : 0);
            fr.graphics.drawRect(0, 0, width, height);
            fr.graphics.endFill();
            this.fr = fr;
            fr.x = x;
            fr.y = y;
            fr.anchorOffsetX = 0;
            fr.anchorOffsetY = 0.5;
            parentNode.addChild(fr);
        };
        return UIProgress;
    }());
    fly.UIProgress = UIProgress;
    __reflect(UIProgress.prototype, "fly.UIProgress");
})(fly || (fly = {}));
//# sourceMappingURL=UIProgress.js.map