module fly {
	export class PassScene extends egret.DisplayObjectContainer {
        public constructor() {
            super()
        }

		// reasons:string[] = ["恭喜过关！", "你饿死了！", "你胖死了！", "你被陷阱杀死了！", "你太胖，摔死了！", "你被AI抓到了！"]

		private movieclip:egret.MovieClip
		private enterGameBtn:egret.Bitmap
		private backGameBtn:egret.Bitmap
		private erweima:egret.Bitmap
		private reason:number
		private mgr:SceneManager

        public initScene(reason:number, mgr:SceneManager):void{
			this.reason = reason
			this.mgr = mgr

			// 背景
			var bg = FlyTools.createBitmapByName("background_jpg")
			bg.scaleX = FlyConfig.width/bg.width
			bg.scaleY = FlyConfig.height/bg.height
			this.addChild(bg)

			// 标题
			let title_bg = new  egret.Bitmap();
            title_bg.texture = RES.getRes("title_png");
            title_bg.anchorOffsetX = title_bg.width/2
            title_bg.anchorOffsetY = title_bg.height/2
            title_bg.x = FlyConfig.stageWidth/2;
            title_bg.y = 170;
            title_bg.scaleX = title_bg.scaleY = 2;
            this.addChild(title_bg);


			let array = []
			if (reason == 0)
			{
				array = this.createWinScene()
			}
			else if(reason > 0)
			{
				array = this.createLoseScene(reason)
			}
			else
			{
				array = this.createPassScene()
			}

			// 原因
			var text:egret.TextField = new egret.TextField()
			text.text = array[0]
			text.size = 48
			text.textColor = 0x000000
			text.anchorOffsetX = text.width/2
			text.anchorOffsetY = text.height/2
			text.x = FlyConfig.stageWidth/2
			text.y = this.movieclip.y + this.movieclip.height*2 + 30
			this.addChild(text);

			// 二维码
			let erweima = FlyTools.createBitmapByName("erweima_png")
            erweima.anchorOffsetX = erweima.width/2
            erweima.anchorOffsetY = erweima.height/2
            erweima.x = FlyConfig.stageWidth/2
            erweima.y = text.y + text.height*2 + 220;
            erweima.scaleX = erweima.scaleY = 1.5;
			erweima.visible = false
			this.addChild(erweima)
			this.erweima = erweima

			// 下一步
			var enterGameBtn = FlyTools.createBitmapByName(array[1])
            enterGameBtn.anchorOffsetX = enterGameBtn.width/2
            enterGameBtn.anchorOffsetY = enterGameBtn.height/2
            enterGameBtn.x = FlyConfig.stageWidth/2
            enterGameBtn.y = text.y + text.height*2 + 150;
            enterGameBtn.scaleX = enterGameBtn.scaleY = 2;
            this.addChild(enterGameBtn);
			this.enterGameBtn = enterGameBtn

			// 返回
			var backGameBtn = FlyTools.createBitmapByName("backBtn_png")
            backGameBtn.anchorOffsetX = backGameBtn.width/2
            backGameBtn.anchorOffsetY = backGameBtn.height/2
            backGameBtn.x = FlyConfig.stageWidth/2
            backGameBtn.y = this.enterGameBtn.y + this.enterGameBtn.height + 150;
            backGameBtn.scaleX = backGameBtn.scaleY = 2;
            this.addChild(backGameBtn);
			this.backGameBtn = backGameBtn

			this.touchEnabled = true
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin,    this)
			this.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchClick,    this)
			this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchCancel,   this)
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchCancel,   this)
        }

		private createWinScene()
		{
			let objmgr = ObjectManager.inst()

			// 过场动画
			let png = new egret.MovieClip(objmgr.winFactory.generateMovieClipData("Win"));
			png.gotoAndPlay("play", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = FlyConfig.stageWidth/2 - 10
			png.y = FlyConfig.stageHeight/2 - 270
			png.scaleX = png.scaleY = 2
			this.addChild(png)
			this.movieclip = png

			return ["多吃少运动，胖的真可爱！", "nextBtn_png"]
		}

		private createLoseScene(reason:number)
		{
			let objmgr = ObjectManager.inst()

			// 过场动画
			let png = new egret.MovieClip(objmgr.dieFactory.generateMovieClipData("playerDie"));
			png.gotoAndPlay("die"+reason, -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = FlyConfig.stageWidth/2 - 10
			png.y = FlyConfig.stageHeight/2 - 270
			png.scaleX = png.scaleY = 2
			this.addChild(png)
			this.movieclip = png

			return ["大风大雨也刮不跑你！", "againBtn_png"]
		}


		private createPassScene()
		{
			let objmgr = ObjectManager.inst()

			// 过场动画
			let png = new egret.MovieClip(objmgr.winFactory.generateMovieClipData("Win"));
			png.gotoAndPlay("play", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = FlyConfig.stageWidth/2 - 10
			png.y = FlyConfig.stageHeight/2 - 270
			png.scaleX = png.scaleY = 2
			this.addChild(png)
			this.movieclip = png

			var txt = "我死了" + SceneManager.inst().health + "次完成所有关卡！不服来战！"
			if (SceneManager.inst().health == 0)
			{
				txt = "不是一家胖人，不进一家胖门！"
			}

			return [txt, "shareBtn_png"]
		}

		private onTouchBegin(evt:egret.TouchEvent) {
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY)){
                this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 1.8;
            }
			else if(this.backGameBtn.hitTestPoint(evt.localX,evt.localY)){
                this.backGameBtn.scaleX = this.backGameBtn.scaleY = 1.8;
            }
        }

        private  onTouchClick(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            this.backGameBtn.scaleX = this.backGameBtn.scaleY = 2;
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY)){
				this.erweima.visible = true
				this.enterGameBtn.visible = false
				this.backGameBtn.visible = false
				this.mgr.onClickBtn(this.reason)
            }
			else if(this.backGameBtn.hitTestPoint(evt.localX,evt.localY)){
				this.mgr.onClickBack()
            }
        }

        private  onTouchCancel(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            this.backGameBtn.scaleX = this.backGameBtn.scaleY = 2;
        }
	}
}