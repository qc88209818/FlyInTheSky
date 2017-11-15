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
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new UILoading();
        this.loadingView.x = this.stage.stageWidth / 2;
        this.loadingView.y = this.stage.stageHeight / 2;
        this.stage.addChild(this.loadingView);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    Main.prototype.onConfigComplete = function () {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.stage.removeChild(this.loadingView);
            this.loadTiledMap();
        }
    };
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    Main.prototype.onResourceLoadError = function (event) {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    };
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    Main.prototype.loadTiledMap = function () {
        /*初始化资源加载路径*/
        this.url = "resource/map/battle1.tmx";
        /*初始化请求*/
        this.request = new egret.HttpRequest();
        /*监听资源加载完成事件*/
        this.request.once(egret.Event.COMPLETE, this.onMapComplete, this);
        /*发送请求*/
        this.request.open(this.url, egret.HttpMethod.GET);
        this.request.send();
    };
    /*地图加载完成*/
    Main.prototype.onMapComplete = function (event) {
        /*获取到地图数据*/
        var data = egret.XML.parse(event.currentTarget.response);
        // 初始化一些有用参数
        fly.FlyConfig.width = data["$width"] * data["$tilewidth"];
        fly.FlyConfig.height = data["$height"] * data["$tileheight"];
        fly.FlyConfig.stageWidth = this.stage.stageWidth;
        fly.FlyConfig.stageHeight = this.stage.stageHeight;
        var tiledMapObjs = [];
        // 初始化TiledMap Object
        data.children.forEach(function (group) {
            var groupxml = group;
            groupxml.children.forEach(function (object) {
                var objectxml = object;
                var tmObj = new TiledMapObject();
                tmObj.type = objectxml["$type"];
                tmObj.x = objectxml["$x"] * 1.0;
                tmObj.y = objectxml["$y"] * 1.0;
                tmObj.width = objectxml["$width"] * 1.0;
                tmObj.height = objectxml["$height"] * 1.0;
                tiledMapObjs.push(tmObj);
            });
        });
        this.initGame(tiledMapObjs);
    };
    Main.prototype.initGame = function (tiledMapObjs) {
        egret.lifecycle.addLifecycleListener(function (conttext) {
            conttext.onUpdate = function () {
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
        // 战斗场景
        var scene = new fly.BattleScene();
        scene.initScene(tiledMapObjs);
        this.stage.addChild(scene);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map