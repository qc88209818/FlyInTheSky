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
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(x, y, radius) {
            var _this = _super.call(this) || this;
            _this.step = -1;
            _this.x = x + radius;
            _this.y = y + radius;
            _this.radius = radius;
            _this.power = fly.FlyParam.PlayerInitPower;
            _this.mass = fly.FlyParam.PlayerInitMass;
            _this.initBody({
                id: fly.FlyConfig.getPlayerId(),
                mass: _this.mass,
                type: p2.Body.DYNAMIC,
                fixedRotation: true,
                position: [x, y]
            });
            _this.initShape(_this.radius);
            _this.setGroupAndMask(fly.ObjectGroup.Player, fly.ObjectMask.Player);
            _this.initBitmap();
            _this.updatePosition();
            _this.changePower(_this.power);
            return _this;
        }
        Player.prototype.setVisible = function (visible) {
            this.progress.visible = visible;
        };
        Player.prototype.changePower = function (power) {
            this.power = power;
            this.progress.changeValue(this.power);
            // 1 饿死
            if (power < fly.FlyParam.PlayerMinPower) {
                this.died(1);
                return;
            }
            for (var i = 0; i < fly.FlyParam.PlayerStep.length; ++i) {
                if (power <= fly.FlyParam.PlayerStep[i]) {
                    if (this.step != i) {
                        this.circle.radius = this.radius * fly.FlyParam.PlayerTijiScale[i];
                        this.circle.updateArea();
                        this.body.mass = this.mass * fly.FlyParam.PlayerMassScale[i];
                        this.body.updateMassProperties();
                        this.render.scaleX = 2.2 * this.circle.radius / this.render.width;
                        this.render.scaleY = 2.2 * this.circle.radius / this.render.height;
                        this.changeRenderSize(this.circle.radius);
                        this.step = i;
                    }
                    return;
                }
            }
            // 2 胖死
            if (power > fly.FlyParam.PlayerMaxPower) {
                this.died(2);
                return;
            }
        };
        Player.prototype.initBitmap = function () {
            var png = fly.FlyTools.createBitmapByName("player_down_png");
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.scaleX = 2.2 * this.radius / png.width;
            png.scaleY = 2.2 * this.radius / png.height;
            this.addChild(png);
            this.render = png;
            var progress = new fly.UIProgress();
            progress.create(fly.FlyParam.PlayerMaxPower, fly.FlyParam.PlayerMinPower, fly.FlyParam.PlayerInitPower);
            progress.anchorOffsetX = progress.width / 2;
            progress.anchorOffsetY = progress.height / 2;
            progress.visible = false;
            this.addChild(progress);
            this.progress = progress;
            progress.setPosition(progress.width / 2, -100);
        };
        Player.prototype.addPower = function (value) {
            this.power += value;
            this.progress.changeValue(this.power);
        };
        Player.prototype.reset = function (x, y) {
            this.body.position = [x, y];
            this.body.velocity = [0, 0];
            this.body.force = [0, 0];
            this.changePower(fly.FlyParam.PlayerInitPower);
        };
        Player.prototype.died = function (reason) {
            // 1 饿死
            // 2 胖死
            console.log("你死了！", reason);
            this.reset(this.x, this.y);
        };
        return Player;
    }(fly.FlyCircle));
    fly.Player = Player;
    __reflect(Player.prototype, "fly.Player");
})(fly || (fly = {}));
//# sourceMappingURL=Player.js.map