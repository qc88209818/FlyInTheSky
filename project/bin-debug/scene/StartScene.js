var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var StartScene = (function () {
        function StartScene() {
        }
        StartScene.prototype.initScene = function (parent, width, height) {
            this.parent = parent;
            this.width = width;
            this.height = height;
            this.loadTiledMap();
        };
        StartScene.prototype.loadTiledMap = function () {
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
        StartScene.prototype.onMapComplete = function (event) {
            /*获取到地图数据*/
            var data = egret.XML.parse(event.currentTarget.response);
            // 初始化一些有用参数
            fly.FlyConfig.width = data["$width"] * data["$tilewidth"];
            fly.FlyConfig.height = data["$height"] * data["$tileheight"];
            fly.FlyConfig.stageWidth = this.width;
            fly.FlyConfig.stageHeight = this.height;
            var tiledMapObjs = [];
            // 初始化TiledMap Object
            data.children.forEach(function (group) {
                var groupxml = group;
                groupxml.children.forEach(function (object) {
                    var objectxml = object;
                    var tmObj = new TiledMapObject();
                    tmObj.name = objectxml["$name"];
                    tmObj.type = objectxml["$type"];
                    tmObj.x = Number(objectxml["$x"]);
                    tmObj.y = Number(objectxml["$y"]);
                    tmObj.width = Number(objectxml["$width"] * 1.0);
                    tmObj.height = Number(objectxml["$height"] * 1.0);
                    // properties
                    objectxml.children.forEach(function (properties) {
                        var propertiesxml = properties;
                        propertiesxml.children.forEach(function (property) {
                            tmObj.params[property["$name"]] = property["$value"];
                        });
                    });
                    tiledMapObjs.push(tmObj);
                });
            });
            var battlescene = new fly.BattleScene();
            battlescene.initScene(tiledMapObjs);
            this.parent.addChild(battlescene);
        };
        return StartScene;
    }());
    fly.StartScene = StartScene;
    __reflect(StartScene.prototype, "fly.StartScene");
})(fly || (fly = {}));
//# sourceMappingURL=StartScene.js.map