module fly {
	export class EnterGameScene extends egret.Sprite {

        private music:FlyMusic = new FlyMusic()
	
        public constructor() {
            super()
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeStage,this);
        }

        private title_bg:egret.Bitmap ;
        private enterGameBtn:egret.Bitmap;
        private  onAddToStage():void{
            this.music.playObject("start.mp3")
 
            let width = FlyConfig.stageWidth
            let height = FlyConfig.stageHeight

            let bg = fly.FlyTools.createBitmapByName("background_jpg")
            bg.scaleX = width/bg.width
			bg.scaleY = height/bg.height
            this.addChild(bg)

            let title_bg = new  egret.Bitmap();
            title_bg.texture = RES.getRes("title_png");
            title_bg.anchorOffsetX = title_bg.width/2
            title_bg.anchorOffsetY = title_bg.height/2
            title_bg.x = width/2;
            title_bg.y = 170;
            title_bg.scaleX = title_bg.scaleY = 2;
            this.addChild(title_bg);
            this.title_bg = title_bg

            // 过场动画
            let png = new egret.MovieClip(ObjectManager.inst().winFactory.generateMovieClipData("Win"));
			png.gotoAndPlay("play", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = width/2 - 10
			png.y = height/2 - 240
			png.scaleX = png.scaleY = 2
			this.addChild(png)

            // 开始按钮
            let enterGameBtn = FlyTools.createBitmapByName("playBtn_png")
            enterGameBtn.anchorOffsetX = enterGameBtn.width/2
            enterGameBtn.anchorOffsetY = enterGameBtn.height/2
            enterGameBtn.x = width/2
            enterGameBtn.y = png.y + png.height*2 + 180;
            enterGameBtn.scaleX = enterGameBtn.scaleY = 2;
            this.addChild(enterGameBtn);
            this.enterGameBtn = enterGameBtn

            this.touchEnabled = true
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this)
			this.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchClick,   this)
			this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchCancel,   this)
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchCancel,   this)
        }

        private removeStage():void{
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeStage, this);
        }

        public onTouchBegin(evt:egret.TouchEvent) {
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY + FlyConfig.deltaHeight)){
                     this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 1.8;
                }     
        }

        private  onTouchClick(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            if(this.enterGameBtn.hitTestPoint(evt.localX, evt.localY + FlyConfig.deltaHeight)){
                    this.music.stop()

                    let parent = this.parent
                    parent.removeChild(this);
                    let mgr = fly.SceneManager.inst();
                    mgr.init(parent);
                    mgr.load(1)
                }
        }

        private  onTouchCancel(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
        }
	}
}