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
    var WeightBlock = (function (_super) {
        __extends(WeightBlock, _super);
        function WeightBlock(x, y, width, height, op) {
            var _this = _super.call(this) || this;
            _this.baseScale = 1.5;
            _this.x = x;
            _this.y = y;
            _this.width = width;
            _this.height = height;
            _this.min = op.min || 0;
            _this.max = op.max || 999;
            _this.initBody({
                id: fly.FlyConfig.getBlockId(),
                mass: op.mass || 1,
                type: op.type || p2.Body.KINEMATIC,
                fixedRotation: true,
                position: [_this.x, _this.y],
                damping: op.damping || 0
            });
            _this.initShape(_this.width, _this.height);
            _this.setGroupAndMask(fly.ObjectGroup.Block, fly.ObjectMask.Block);
            _this.initBitmap(op.path);
            _this.updatePosition();
            _this.setRotation(op.rotation);
            return _this;
        }
        WeightBlock.prototype.initBitmap = function (path) {
            var png = fly.FlyTools.createBitmapByName(path);
            png.scaleX = this.baseScale * this.width / png.width;
            png.scaleY = this.baseScale * this.height / png.height;
            this.addChild(png);
        };
        WeightBlock.prototype.onContactBegin = function (pid) {
            var _this = this;
            this.objmgr.players.forEach(function (player) {
                if (player.body.id == pid) {
                    if (_this.min < player.body.mass && player.body.mass < _this.max) {
                        var normal = [];
                        p2.vec2.normalize(normal, player.body.velocity);
                        _this.body.velocity = [normal[0] * 100, normal[1] * 100];
                    }
                    console.log(_this.min, player.body.mass, _this.max);
                    return;
                }
            });
        };
        WeightBlock.prototype.onContactEnd = function (pid) {
            this.body.velocity = [0, 0];
        };
        return WeightBlock;
    }(fly.FlyRect));
    fly.WeightBlock = WeightBlock;
    __reflect(WeightBlock.prototype, "fly.WeightBlock");
})(fly || (fly = {}));
//# sourceMappingURL=WeightBlock.js.map