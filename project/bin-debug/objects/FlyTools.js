var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var FlyTools = (function () {
        function FlyTools() {
        }
        FlyTools.createBitmapByName = function (name) {
            var result = new egret.Bitmap();
            var texture = RES.getRes(name);
            result.texture = texture;
            return result;
        };
        FlyTools.getBodyTypeColor = function (bodyType) {
            if (bodyType == p2.Body.STATIC)
                return 0xFF0000;
            else if (bodyType == p2.Body.DYNAMIC)
                return 0x00FF00;
            else if (bodyType == p2.Body.KINEMATIC)
                return 0x0000FF;
            else
                return 0xFFFFFF;
        };
        FlyTools.showToast = function (tt) {
            var text = new egret.TextField();
            text.text = tt;
            text.width = 400;
            text.anchorOffsetX = text.width / 2;
            text.anchorOffsetY = text.height / 2;
            return text;
        };
        return FlyTools;
    }());
    fly.FlyTools = FlyTools;
    __reflect(FlyTools.prototype, "fly.FlyTools");
})(fly || (fly = {}));
//# sourceMappingURL=FlyTools.js.map