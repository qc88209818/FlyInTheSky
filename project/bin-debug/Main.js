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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        fly.FlyConfig.DebugMode = true;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        this.createGameScene();
        egret.lifecycle.addLifecycleListener(function (conttext) {
            conttext.onUpdate = function () {
                console.log('Start Game2!');
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
            console.log('Game2 onPause!');
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
            console.log('Game2 onResume!');
        };
        //添加帧事件侦听
        egret.Ticker.getInstance().register(function (dt) {
            //使世界时间向后运动
            this.world.step(dt / 1000);
            this.ball.updatePosition();
        }, this);
    };
    Main.prototype.createGameScene = function () {
        this.world = new p2.World({
            gravity: [0, 100]
        });
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        var wall1 = new fly.Wall(0, 0, this.stage.stageWidth, 10);
        var wall2 = new fly.Wall(0, 0, 10, this.stage.stageHeight);
        var wall3 = new fly.Wall(this.stage.stageWidth, this.stage.stageHeight, this.stage.stageWidth - 10, 0);
        var wall4 = new fly.Wall(this.stage.stageWidth, this.stage.stageHeight, 0, this.stage.stageHeight - 10);
        this.addToWorld(wall1);
        this.addToWorld(wall2);
        this.addToWorld(wall3);
        this.addToWorld(wall4);
        this.ball = new fly.Candy(300, 300, 100);
        this.addToWorld(this.ball);
    };
    Main.prototype.addToWorld = function (obj) {
        this.stage.addChild(obj.body.displays[0]);
        this.world.addBody(obj.body);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map