
class Main extends egret.DisplayObjectContainer {
    loadingView:UILoading
    
    isLoadRes:boolean = false
    isLoadThm:boolean = false

    public constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
    }

    private onAddToStage(event: egret.Event) 
    {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this)
        RES.loadConfig("resource/default.res.json", "resource/")
    }

    private onConfigComplete() 
    {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this)
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this)
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this)
        RES.loadGroup("loadUI")
    }

    private onResourceLoadComplete(event: RES.ResourceEvent)
    {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this)
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this)
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this)

            this.isLoadRes = true
            this.init()
        }else if(event.groupName == "loadUI"){
             //设置加载进度界面
            this.loadingView = new UILoading();
            this.loadingView.x = this.stage.stageWidth/2-200;
            this.loadingView.y = this.stage.stageHeight/2;
            this.loadingView.scaleX = 2;
            this.loadingView.scaleY = 2;
            this.stage.addChild(this.loadingView);
            RES.loadGroup("preload")
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

    private onThemeLoadComplete()
    {
        this.isLoadThm = true
        this.init()
    }

    private init()
    {
        if (this.isLoadRes && this.isLoadThm)
        {            
            this.stage.removeChild(this.loadingView)
            this.initGame()
        }
    }

    private initGame()
    {
        // var wid = document.documentElement.clientWidth;
        // var hei = document.documentElement.clientHeight;
 
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

        // 选择界面
        //let mgr = fly.SceneManager.inst()
      //  mgr.init(this, this.stage.stageWidth, this.stage.stageHeight)
        //mgr.load(1)

        let enterGameScene = new fly.EnterGameScene();
        this.addChild(enterGameScene);
    }
}