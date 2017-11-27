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
        function Player(x, y, width, height) {
            var _this = _super.call(this) || this;
            _this.baseScale = 1.5;
            _this.step = -1;
            _this.inoperable = 0;
            _this.limitVel = 50;
            _this.dir = 1;
            _this.nowState = "front_move";
            _this.x = x + width / 2;
            _this.y = y + height / 2;
            _this.width = width;
            _this.height = height;
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
            _this.initShape(_this.width, _this.height);
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
            var len = p2.vec2.len(this.body.velocity);
            if (this.body.velocity[1] < 0 && x < y) {
                if (len < this.limitVel) {
                    if (this.nowState == "black_stand")
                        return;
                    this.render.gotoAndPlay("black_stand", -1);
                    this.nowState = "black_stand";
                }
                else {
                    if (this.nowState == "black_move")
                        return;
                    this.render.gotoAndPlay("black_move", -1);
                    this.nowState = "black_move";
                }
            }
            else if (this.body.velocity[1] > 0 && x < y) {
                if (len < this.limitVel) {
                    if (this.nowState == "front_stand")
                        return;
                    this.render.gotoAndPlay("front_stand", -1);
                    this.nowState = "front_stand";
                }
                else {
                    if (this.nowState == "front_move")
                        return;
                    this.render.gotoAndPlay("front_move", -1);
                    this.nowState = "front_move";
                }
            }
            else if (this.body.velocity[0] > 0 && x > y) {
                this.dir = 1;
                this.render.scaleX = this.baseScale * this.rect.width / this.render.width;
                if (len < this.limitVel) {
                    if (this.nowState == "side_stand_right")
                        return;
                    this.render.gotoAndPlay("side_stand", -1);
                    this.nowState = "side_stand_right";
                }
                else {
                    if (this.nowState == "side_move_right")
                        return;
                    this.render.gotoAndPlay("side_move", -1);
                    this.nowState = "side_move_right";
                }
            }
            else if (this.body.velocity[0] < 0 && x > y) {
                this.dir = -1;
                this.render.scaleX = -this.baseScale * this.rect.width / this.render.width;
                if (len < this.limitVel) {
                    if (this.nowState == "side_stand_left")
                        return;
                    this.render.gotoAndPlay("side_stand", -1);
                    this.nowState = "side_stand_left";
                }
                else {
                    if (this.nowState == "side_move_left")
                        return;
                    this.render.gotoAndPlay("side_move", -1);
                    this.nowState = "side_move_left";
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
                        this.rect.width = this.width * fly.FlyParam.PlayerTijiScale[i];
                        this.rect.height = this.height * fly.FlyParam.PlayerTijiScale[i];
                        this.rect.updateArea();
                        this.body.mass = this.mass * fly.FlyParam.PlayerMassScale[i];
                        this.body.updateMassProperties();
                        this.render.scaleX = this.dir * this.baseScale * this.rect.width / this.render.width;
                        this.render.scaleY = this.baseScale * this.rect.width / this.render.height;
                        this.changeRenderSize(this.rect.width, this.rect.height);
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
            this.body.velocity = [x / this.body.mass, y / this.body.mass];
        };
        Player.prototype.initBitmap = function () {
            var png = new egret.MovieClip(this.objmgr.mcFactory.generateMovieClipData("normalState"));
            png.gotoAndPlay("front_stand", -1);
            png.anchorOffsetX = png.width / 2 + 8;
            png.anchorOffsetY = png.height / 2 + 5;
            png.scaleX = this.baseScale * this.width / png.width;
            png.scaleY = this.baseScale * this.height / png.height;
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
    }(fly.FlyRect));
    fly.Player = Player;
    __reflect(Player.prototype, "fly.Player");
})(fly || (fly = {}));
//# sourceMappingURL=Player.js.map