module fly {
	export class PassScene extends egret.DisplayObjectContainer {
        public constructor() {
            super()
        }

		// reasons:string[] = ["恭喜过关！", "你饿死了！", "你胖死了！", "你被陷阱杀死了！", "你太胖，摔死了！", "你被AI抓到了！"]

		enterGameBtn:egret.Bitmap
		shareGameBtn:egret.Bitmap
		erweima:egret.Bitmap

		private movieclip:egret.MovieClip
		private reason:number
		private mgr:SceneManager
		private objmgr:ObjectManager

		private dieReason:string[] = ["die1", "die1", "die2", "die2", "die2", "die2"]

        public initScene(reason:number, mgr:SceneManager):void{
			this.reason = reason
			this.mgr = mgr
			this.objmgr = ObjectManager.inst()

			// 背景
			var bg = FlyTools.createBitmapByName("background_jpg")
			bg.scaleX = FlyConfig.width/bg.width
			bg.scaleY = FlyConfig.height/bg.height
			this.addChild(bg)

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
			var text = new egret.TextField()
			text.text = array[0]
			text.size = 48
			text.stroke = 2;
        	text.strokeColor = 0x000000;
			text.textColor = 0xFFFFFF;
			text.anchorOffsetX = text.width/2
			text.anchorOffsetY = text.height/2
			text.x = FlyConfig.stageWidth/2
			text.y = this.movieclip.y + this.movieclip.height*2
			this.addChild(text);

			// 本次用时 
			var text2= new egret.TextField()
			if (reason < 0)
			{	
				text2.text = "最佳用时: " + parseInt(""+this.mgr.getPassTimeAll()*10, 10)/10 + "秒"
			}
			else if (reason == 0)
			{	
				text2.text = "本次用时: " + parseInt(""+this.mgr.getLastTime()*10, 10)/10 + "秒" + " (最短用时: " + parseInt(""+this.mgr.getPassTime()*10, 10)/10 + "秒)"
			}
			else
			{
				text2.text = "当前剩余生命: " + this.mgr.health
			}
			text2.size = 36
			text2.stroke = 2;
        	text2.strokeColor = 0x000000;
			text2.textColor = 0xFFFFFF;
			text2.anchorOffsetX = text2.width/2
			text2.anchorOffsetY = text2.height/2
			text2.x = FlyConfig.stageWidth/2
			text2.y = this.movieclip.y + this.movieclip.height*2 + text.height + 10
			this.addChild(text2);

			// 二维码
			let erweima = FlyTools.createBitmapByName("erweima_png")
            erweima.anchorOffsetX = erweima.width/2
            erweima.anchorOffsetY = erweima.height/2
            erweima.x = FlyConfig.stageWidth/2
            erweima.y = text2.y + text2.height*2 + 200;
            erweima.scaleX = erweima.scaleY = 1.5;
			erweima.visible = false
			this.addChild(erweima)
			this.erweima = erweima

			// 下一步
			var enterGameBtn = FlyTools.createBitmapByName(array[1])
            enterGameBtn.anchorOffsetX = enterGameBtn.width/2
            enterGameBtn.anchorOffsetY = enterGameBtn.height/2
            enterGameBtn.x = FlyConfig.stageWidth/2
            enterGameBtn.y = text2.y + text2.height*2 + 80; 
            enterGameBtn.scaleX = enterGameBtn.scaleY = 2
            this.addChild(enterGameBtn)
			this.enterGameBtn = enterGameBtn

			// 分享
			var shareGameBtn = FlyTools.createBitmapByName("shareBtn_png")
            shareGameBtn.anchorOffsetX = shareGameBtn.width/2
            shareGameBtn.anchorOffsetY = shareGameBtn.height/2
            shareGameBtn.x = FlyConfig.stageWidth/2
            shareGameBtn.y = this.enterGameBtn.y + this.enterGameBtn.height + 120
            shareGameBtn.scaleX = shareGameBtn.scaleY = 2
            this.addChild(shareGameBtn)
			this.shareGameBtn = shareGameBtn

			this.touchEnabled = true
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin,    this)
			this.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchClick,    this)
			this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchCancel,   this)
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchCancel,   this)
        }

		private createWinScene()
		{
			// 标题
			let title_bg = FlyTools.createBitmapByName("Victory_png")
            title_bg.anchorOffsetX = title_bg.width/2
            title_bg.anchorOffsetY = title_bg.height/2
            title_bg.x = FlyConfig.stageWidth/2
            title_bg.y = FlyConfig.deltaHeight + 120
            title_bg.scaleX = title_bg.scaleY = 2
            this.addChild(title_bg);
			
			// 过场动画
			let png = new egret.MovieClip(this.objmgr.winFactory.generateMovieClipData("Win"));
			png.gotoAndPlay("play", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = FlyConfig.stageWidth/2 - 100
			png.y = FlyConfig.stageHeight/2 - 280
			png.scaleX = png.scaleY = 2.5
			this.addChild(png)
			this.movieclip = png

			return ["多吃少运动，胖的真可爱！", "nextBtn_png"]
		}

		private createLoseScene(reason:number)
		{
			// 标题
			let title_bg = FlyTools.createBitmapByName("Defeat_png")
            title_bg.anchorOffsetX = title_bg.width/2
            title_bg.anchorOffsetY = title_bg.height/2
            title_bg.x = FlyConfig.stageWidth/2
            title_bg.y = FlyConfig.deltaHeight + 120
            title_bg.scaleX = title_bg.scaleY = 2
            this.addChild(title_bg)

			// 过场动画
			let png = null
			if (reason == 4)
			{
				png = new egret.MovieClip(this.objmgr.iceFactory.generateMovieClipData("ice"));
				png.gotoAndPlay("drop", -1)
				png.anchorOffsetY = png.height*0.15
				png.y = FlyConfig.stageHeight/2 - 360
			}
			else
			{
				png = new egret.MovieClip(this.objmgr.dieFactory.generateMovieClipData("playerDie"));
				png.gotoAndPlay(this.dieReason[reason], -1)
				png.anchorOffsetY = png.height*0.5
				png.y = FlyConfig.stageHeight/2 - 280
			}
			png.anchorOffsetX = png.width/2
			png.x = FlyConfig.stageWidth/2 - 10
			png.scaleX = png.scaleY = 2
			this.addChild(png)
			this.movieclip = png

			return ["大风大雨也刮不跑你！", "againBtn_png"]
		}

		private createPassScene()
		{
			// 标题
			let title_bg = FlyTools.createBitmapByName("title_png")
            title_bg.anchorOffsetX = title_bg.width/2
            title_bg.anchorOffsetY = title_bg.height/2
            title_bg.x = FlyConfig.stageWidth/2
            title_bg.y = FlyConfig.deltaHeight + 160
            title_bg.scaleX = title_bg.scaleY = 2
            this.addChild(title_bg);

			// 过场动画
			let png = new egret.MovieClip(this.objmgr.mcFactory.generateMovieClipData("playerState"));
			png.gotoAndPlay("front_move_fat", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = FlyConfig.stageWidth/2
			png.y = FlyConfig.stageHeight/2 - 240
			png.scaleX = png.scaleY = 2
			this.addChild(png)
			this.movieclip = png

			var txt = "我死了" + (2 - SceneManager.inst().health) + "次完成所有关卡！不服来战！"
			if (SceneManager.inst().health == 0)
			{
				txt = "减肥真的这样简单该有多好！"
			}

			return [txt, "backBtn_png"]
		}

		private onTouchBegin(evt:egret.TouchEvent) {
            if(this.enterGameBtn.visible && this.enterGameBtn.hitTestPoint(evt.localX,evt.localY + FlyConfig.deltaHeight)){
                this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 1.8;
            }
			else if(this.shareGameBtn.visible && this.shareGameBtn.hitTestPoint(evt.localX,evt.localY + FlyConfig.deltaHeight)){
                this.shareGameBtn.scaleX = this.shareGameBtn.scaleY = 1.8;
            }
        }

        private  onTouchClick(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            this.shareGameBtn.scaleX = this.shareGameBtn.scaleY = 2;
            if(this.enterGameBtn.visible && this.enterGameBtn.hitTestPoint(evt.localX,evt.localY + FlyConfig.deltaHeight)){
				this.mgr.onClickBtn(this.reason)
            }
			else if(this.shareGameBtn.visible && this.shareGameBtn.hitTestPoint(evt.localX,evt.localY + FlyConfig.deltaHeight)){
				this.mgr.onClickShare()
            }
        }

        private  onTouchCancel(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            this.shareGameBtn.scaleX = this.shareGameBtn.scaleY = 2;
        }
	}
}