
class Main extends egret.DisplayObjectContainer {
    loadingView:UILoading
    private url:string
    private request:egret.HttpRequest

    public constructor() {
        super()

        fly.FlyConfig.DebugMode = true

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
    }

    private onAddToStage(event: egret.Event) 
    {
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new UILoading();
        this.loadingView.x = this.stage.stageWidth/2;
        this.loadingView.y = this.stage.stageHeight/2;
        this.stage.addChild(this.loadingView);

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this)
        RES.loadConfig("resource/default.res.json", "resource/")
    }

    private onConfigComplete() 
    {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this)
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this)
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this)
        RES.loadGroup("preload")
    }

    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent)
    {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this)
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this)
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this)
            this.stage.removeChild(this.loadingView)
            this.loadTiledMap()
        }
    }

    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load")
    }

    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " has failed to load")
        this.onResourceLoadComplete(event)
    }

    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload")
        {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal)
        }
    }

    private loadTiledMap()
    {
        /*初始化资源加载路径*/
        this.url = "resource/map/battle1.tmx"; 
        /*初始化请求*/
        this.request = new egret.HttpRequest();
        /*监听资源加载完成事件*/
        this.request.once(egret.Event.COMPLETE, this.onMapComplete,this);
        /*发送请求*/
        this.request.open(this.url,egret.HttpMethod.GET);
        this.request.send();
    }

    /*地图加载完成*/
    private onMapComplete(event:egret.Event) {
        /*获取到地图数据*/
        let data = egret.XML.parse(event.currentTarget.response);

        // 初始化一些有用参数
        fly.FlyConfig.width = data["$width"]*data["$tilewidth"]
        fly.FlyConfig.height = data["$height"]*data["$tileheight"]
        fly.FlyConfig.stageWidth = this.stage.stageWidth
        fly.FlyConfig.stageHeight = this.stage.stageHeight

        let tiledMapObjs = []
        // 初始化TiledMap Object
        data.children.forEach(group => {
            let groupxml = <egret.XML><any>group
            groupxml.children.forEach(object => {
                let objectxml = <egret.XML><any>object
                let tmObj = new TiledMapObject()
                tmObj.name = objectxml["$name"]
                tmObj.type = objectxml["$type"]
                tmObj.x = Number(objectxml["$x"])
                tmObj.y = Number(objectxml["$y"])
                tmObj.width = Number(objectxml["$width"]*1.0)
                tmObj.height = Number(objectxml["$height"]*1.0)

                // properties
                objectxml.children.forEach(properties => {
                    let propertiesxml = <egret.XML><any>properties
                    propertiesxml.children.forEach(property => {
                        tmObj.params.push(property["$name"])
                        tmObj.params.push(property["$value"])
                    })
                })

                tiledMapObjs.push(tmObj)         
            })
        })

        this.initGame(tiledMapObjs)
    }

    private initGame(tiledMapObjs:TiledMapObject[])
    {
        egret.lifecycle.addLifecycleListener((conttext) => {
            conttext.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause()
            console.log('Game2 onPause!')
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume()
            console.log('Game2 onResume!')
        }

        // 战斗场景
        let scene = new fly.BattleScene()
        scene.initScene(tiledMapObjs)
        this.stage.addChild(scene)
    }
}