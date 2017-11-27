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
            _this.baseScale = 2;
            _this.step = -1;
            _this.inoperable = 0; // 不可操作状态
            _this.windyVel = [0, 0]; // 外力影响
            _this.limitVel = 50;
            _this.dir = 1;
            _this.nowState = "";
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
                position: [x, y],
                damping: 0.8
            });
            _this.initShape(_this.radius);
            _this.setGroupAndMask(fly.ObjectGroup.Player, fly.ObjectMask.Player);
            _this.initBitmap();
            _this.updatePosition(0);
            _this.changePower(_this.power);
            return _this;
        }
        Player.prototype.updatePosition = function (dt) {
            if (dt === void 0) { dt = 0; }
            _super.prototype.updatePosition.call(this, dt);
            // 僵直时间
            if (this.inoperable > 0) {
                this.inoperable -= dt;
            }
            var x = Math.abs(this.body.velocity[0]);
            var y = Math.abs(this.body.velocity[1]);
            if (this.body.velocity[1] < 0 && x < y) {
                if (this.nowState == "black_move")
                    return;
                this.movieClip.gotoAndPlay("black_move", -1);
                this.nowState = "black_move";
            }
            else if (this.body.velocity[1] > 0 && x < y) {
                if (this.nowState == "front_move")
                    return;
                this.movieClip.gotoAndPlay("front_move", -1);
                this.nowState = "front_move";
            }
            else if (this.body.velocity[0] > 0 && x > y) {
                if (this.nowState == "side_move_right")
                    return;
                this.dir = 1;
                this.movieClip.scaleX = this.baseScale * this.circle.radius / this.movieClip.width;
                this.movieClip.gotoAndPlay("side_move", -1);
                this.nowState = "side_move_right";
            }
            else if (this.body.velocity[0] < 0 && x > y) {
                if (this.nowState == "side_move_left")
                    return;
                this.movieClip.gotoAndPlay("side_move", -1);
                this.nowState = "side_move_left";
                this.dir = -1;
                this.movieClip.scaleX = -this.baseScale * this.circle.radius / this.movieClip.width;
            }
            if (x == 0 && y == 0) {
                if (this.nowState == "black_move") {
                    this.movieClip.gotoAndPlay("black_stand", -1);
                    this.nowState = "black_stand";
                }
                else if (this.nowState == "front_move") {
                    this.movieClip.gotoAndPlay("front_stand", -1);
                    this.nowState = "front_stand";
                }
                else if (this.nowState == "side_move_right") {
                    this.movieClip.gotoAndPlay("side_stand", -1);
                    this.nowState = "side_stand_right";
                }
                else if (this.nowState == "side_move_left") {
                    this.movieClip.gotoAndPlay("side_stand", -1);
                    this.nowState = "side_stand_left";
                }
            }
        };
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
                        this.movieClip.scaleX = this.dir * this.baseScale * this.circle.radius / this.movieClip.width;
                        this.movieClip.scaleY = this.baseScale * this.circle.radius / this.movieClip.height;
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
        Player.prototype.setVelocity = function (x, y) {
            if (this.inoperable > 0)
                return;
            this.body.velocity = [x / this.body.mass - this.windyVel[0], y / this.body.mass - this.windyVel[1]];
        };
        Player.prototype.initBitmap = function () {
            var png = new egret.MovieClip(this.objmgr.mcFactory.generateMovieClipData("normalState"));
            png.gotoAndPlay("front_stand", -1);
            png.anchorOffsetX = png.width / 2 + 8;
            png.anchorOffsetY = png.height / 2 + 5;
            png.scaleX = this.baseScale * this.radius / png.width;
            png.scaleY = this.baseScale * this.radius / png.height;
            this.addChild(png);
            this.movieClip = png;
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