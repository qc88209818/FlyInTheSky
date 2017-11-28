module fly {
	export class EnterGameScene extends egret.Sprite {
	
        public constructor() {
            super()
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeStage,this);
            }
        private title_bg:egret.Bitmap ;
        private enterGameBtn:egret.Bitmap;
        private  onAddToStage():void{
          
			this.graphics.beginFill(0x000000, 0);
			this.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
			this.graphics.endFill()


            this.title_bg = new  egret.Bitmap();
            this.title_bg.texture = RES.getRes("title_png");
            this.title_bg.anchorOffsetX = this.title_bg.width/2
            this.title_bg.anchorOffsetY = this.title_bg.height/2
            this.title_bg.x = this.stage.stageWidth/2;
            this.title_bg.y = 170;
            this.title_bg.scaleX = this.title_bg.scaleY = 2;
            this.addChild(this.title_bg);

            this.enterGameBtn = new  egret.Bitmap();
            this.enterGameBtn.texture = RES.getRes("playBtn_png");
            this.enterGameBtn.anchorOffsetX = this.enterGameBtn.width/2
            this.enterGameBtn.anchorOffsetY = this.enterGameBtn.height/2
            this.enterGameBtn.x = this.stage.stageWidth/2;
            this.enterGameBtn.y = this.stage.stageHeight/2 - 70;
            this.addChild(this.enterGameBtn);

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
               
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY)){
                     this.enterGameBtn.scaleX =  this.enterGameBtn.scaleY = 0.9;
                }
               
        }

        private  onTouchClick(evt:egret.TouchEvent) {
            console.log(""+ this.enterGameBtn.scaleX )
            this.enterGameBtn.scaleX = 1;
            this.enterGameBtn.scaleY = 1;
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY)){
                    let parent = this.parent
                    parent.removeChild(this);
                    let mgr = fly.SceneManager.inst();
                    mgr.init(parent, parent.stage.stageWidth, parent.stage.stageHeight);
                    mgr.load(1)
                }
            
        }

        private  onTouchCancel(evt:egret.TouchEvent) {
            console.log(""+ this.enterGameBtn.scaleX )
            this.enterGameBtn.scaleX = 1;
            this.enterGameBtn.scaleY = 1;
        }
	}
}