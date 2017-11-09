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
    var Candy = (function (_super) {
        __extends(Candy, _super);
        function Candy(x, y, radious) {
            var _this = _super.call(this) || this;
            _this.x = x + radious;
            _this.y = y + radious;
            _this.radious = radious;
            _super.prototype.initBlock.call(_this, p2.Body.DYNAMIC, _this.x, _this.y, _this.radious);
            _super.prototype.initRender.call(_this, _this.radious);
            return _this;
        }
        return Candy;
    }(fly.FlyBlockCircle));
    fly.Candy = Candy;
    __reflect(Candy.prototype, "fly.Candy");
})(fly || (fly = {}));
//# sourceMappingURL=Candy.js.map