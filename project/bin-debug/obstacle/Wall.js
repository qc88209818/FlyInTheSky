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
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall(x1, y1, x2, y2) {
            var _this = _super.call(this) || this;
            var px = Math.min(x1, x2);
            if (px == x1) {
                _this.width = x2 - x1;
                _this.x = x1 + _this.width / 2;
            }
            if (px == x2) {
                _this.width = x1 - x2;
                _this.x = x2 + _this.width / 2;
            }
            var py = Math.min(y1, y2);
            if (py == y1) {
                _this.height = y2 - y1;
                _this.y = y1 + _this.height / 2;
            }
            if (py == y2) {
                _this.height = y1 - y2;
                _this.y = y2 + _this.height / 2;
            }
            _this.initBody(Wall.wall_id++, p2.Body.STATIC, _this.x, _this.y, _this.width, _this.height);
            // this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block);
            _this.initRender(_this.width, _this.height);
            _this.updatePosition();
            return _this;
        }
        Wall.wall_id = 1000;
        return Wall;
    }(fly.FlyRect));
    fly.Wall = Wall;
    __reflect(Wall.prototype, "fly.Wall");
})(fly || (fly = {}));
//# sourceMappingURL=Wall.js.map