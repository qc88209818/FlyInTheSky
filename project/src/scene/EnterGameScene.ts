module fly {
	export class EnterGameScene extends egret.Sprite {

        public constructor() {
            super()
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeStage,this);
        }

        private title_bg:egret.Bitmap 
        private enterGameBtn:egret.Bitmap
        private movieclip:egret.MovieClip
        private monster1:egret.MovieClip
        private monster2:egret.MovieClip

        private caidanText:egret.TextField
        private caidanCount:number = 10

        private caidan1Num:number = 0
        private caidan1:string[] = [
            "别点了，我要转晕了！",
            "你再点一次试试！",
            "啊！啊！啊！快点停下来！",
            "手动再见！",
        ]

        private caidan2Num:number = 0
        private caidan2:string[] = [
            "你喜欢我吗？",
            "让我抱抱你好吗？",
            "我妈妈喊我回家吃饭了。",
            "下次再跟你玩！",
        ]

        private  onAddToStage():void{
            SceneManager.inst().playMusic("start.mp3")
 
            let width = FlyConfig.stageWidth
            let height = FlyConfig.stageHeight

            let bg = FlyTools.createBitmapByName("background_jpg")
            bg.scaleX = width/bg.width
			bg.scaleY = height/bg.height
            this.addChild(bg)

            // 标题
			let title_bg = FlyTools.createBitmapByName("title_png")
            title_bg.anchorOffsetX = title_bg.width/2
            title_bg.anchorOffsetY = title_bg.height/2
            title_bg.x = width/2
            title_bg.y = FlyConfig.deltaHeight*2 + 160
            title_bg.scaleX = title_bg.scaleY = 2
            this.addChild(title_bg)

            // 过场动画
            let png = new egret.MovieClip(ObjectManager.inst().winFactory.generateMovieClipData("Win"));
			png.gotoAndPlay("play", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = -width
			png.y = height/2 - 200
			png.scaleX = png.scaleY = 2.5
			this.addChild(png)
            this.movieclip = png

            // 开始按钮
            let enterGameBtn = FlyTools.createBitmapByName("playBtn_png")
            enterGameBtn.anchorOffsetX = enterGameBtn.width/2
            enterGameBtn.anchorOffsetY = enterGameBtn.height/2
            enterGameBtn.x = width/2
            enterGameBtn.y = height/2 - 200;
            enterGameBtn.scaleX = enterGameBtn.scaleY = 2;
            this.addChild(enterGameBtn);
            this.enterGameBtn = enterGameBtn

            // 彩蛋
			var caidan = new egret.TextField()
			caidan.text = ""
			caidan.size = 48
            caidan.stroke = 2;
        	caidan.strokeColor = 0x000000;
			caidan.textColor = 0xFFFFFF;
			caidan.anchorOffsetX = caidan.width/2
			caidan.anchorOffsetY = caidan.height/2
			caidan.x = width/2
			caidan.y = enterGameBtn.y + 160
            this.addChild(caidan);
            this.caidanText = caidan

            // 怪物1
            let mon1 = new egret.MovieClip(ObjectManager.inst().dogFactory.generateMovieClipData("dog"));
            mon1.gotoAndPlay("front", -1)
			mon1.anchorOffsetX = mon1.width/2
			mon1.anchorOffsetY = mon1.height
			mon1.x = width/2 + 200
			mon1.y = height/2 + 500
			mon1.scaleX = mon1.scaleY = 2
			this.addChild(mon1)
            this.monster1 = mon1
            this.monster1.addEventListener(egret.Event.COMPLETE, this.afterMovieClip1, this);

            // 怪物2
            let mon2 = new egret.MovieClip(ObjectManager.inst().monFactory.generateMovieClipData("monsterWall"));
            mon2.gotoAndPlay("stand", -1)
			mon2.anchorOffsetX = mon2.width/2
			mon2.anchorOffsetY = mon2.height
			mon2.x = width/2 - 200
			mon2.y = height/2 + 500
            mon2.scaleX = -2
			mon2.scaleY = 2
			this.addChild(mon2)
            this.monster2 = mon2
            this.monster2.addEventListener(egret.Event.COMPLETE, this.afterMovieClip2, this);

            this.touchEnabled = true
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this)
			this.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchClick,   this)
			this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchCancel,   this)
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchCancel,   this)
        }

        private afterMovieClip1()
        {
            this.monster1.gotoAndPlay("front", -1)
        }

        private afterMovieClip2()
        {
            this.monster2.gotoAndPlay("stand", -1)
        }

        private removeStage():void{
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeStage, this);
        }

        public onTouchBegin(evt:egret.TouchEvent) 
        {
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY + FlyConfig.deltaHeight))
            {
                this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 1.8;
            }     
        }

        private  onTouchClick(evt:egret.TouchEvent) 
        {
            let hx = evt.localX
            let hy = evt.localY + FlyConfig.deltaHeight
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            if(this.enterGameBtn.visible && this.enterGameBtn.hitTestPoint(hx, hy)){
                this.Start()
            }
            else if(this.enterGameBtn.visible && this.monster1.visible && this.monster1.hitTestPoint(hx, hy))
            {
                this.monster1.gotoAndPlay("attack", 1)
                this.caidan1Num += 1
                if (this.caidan1Num%this.caidanCount == 0)
                {
                    let idx = parseInt("" + this.caidan1Num/this.caidanCount) - 1
                    if (idx >= this.caidan1.length) 
                    {
                        this.monster1.visible = false
                        return
                    }

                    this.caidanText.text = this.caidan1[idx]
			        this.caidanText.anchorOffsetX = this.caidanText.width/2
                }
            }
            else if(this.enterGameBtn.visible && this.monster2.visible && this.monster2.hitTestPoint(hx, hy))
            {
                this.monster2.gotoAndPlay("attack", 1)
                this.caidan2Num += 1
                if (this.caidan2Num%this.caidanCount == 0)
                {
                    let idx = parseInt("" + this.caidan2Num/this.caidanCount) - 1
                    if (idx >= this.caidan2.length)
                    {
                        this.monster2.visible = false
                        return
                    }
                    
                    this.caidanText.text = this.caidan2[idx]
			        this.caidanText.anchorOffsetX = this.caidanText.width/2
                }
            }
        }

        private  onTouchCancel(evt:egret.TouchEvent) 
        {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
        }

        private tt:number = 10
        private timer: egret.Timer
        private Start()
        {
            this.enterGameBtn.visible = false
            this.caidanText.visible = false

            /*** 本示例关键代码段开始 ***/
            this.timer = new egret.Timer(this.tt, 0)
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.updatePosition, this);
            this.timer.start();

            this.monster1.gotoAndPlay("attack", 2)
            this.monster2.gotoAndPlay("attack", 1)
        }

        private delta:number = 0
        private updatePosition(event:egret.Event) 
        {
            this.delta += this.tt;
            this.movieclip.x += FlyConfig.stageWidth*2.5/(1500/this.tt)
            if (this.delta > 1500)
            {
                this.timer.stop()
                this.parent.removeChild(this)
                SceneManager.inst().load(1)
            }
        }
	}
}