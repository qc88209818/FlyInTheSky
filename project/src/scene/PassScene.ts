module fly {
	export class PassScene extends egret.DisplayObjectContainer {
        public constructor() {
            super()
        }

		// reasons:string[] = ["恭喜过关！", "你饿死了！", "你胖死了！", "你被陷阱杀死了！", "你太胖，摔死了！", "你被AI抓到了！"]

		private enterGameBtn:egret.Bitmap;
		private reason:number
		private mgr:SceneManager

        public initScene(reason:number, mgr:SceneManager):void{
			this.reason = reason
			this.mgr = mgr

			let objmgr = ObjectManager.inst()

			// 标题
			let title_bg = new  egret.Bitmap();
            title_bg.texture = RES.getRes("title_png");
            title_bg.anchorOffsetX = title_bg.width/2
            title_bg.anchorOffsetY = title_bg.height/2
            title_bg.x = FlyConfig.stageWidth/2;
            title_bg.y = 170;
            title_bg.scaleX = title_bg.scaleY = 2;
            this.addChild(title_bg);

			// 死亡动画
			let png = new egret.MovieClip(objmgr.mcFactory.generateMovieClipData("playerState"));
			png.gotoAndPlay("front_move_normal", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.x = FlyConfig.stageWidth/2 - 10
			png.y = FlyConfig.stageHeight/2 - 250
			png.scaleX = 2
			png.scaleY = 2
			this.addChild(png)

			// 原因
			var text:egret.TextField = new egret.TextField()
			text.text = reason>0?"胜败乃兵家常事，请大侠重新来过！":"恭喜过关，请再接再厉！"
			text.size = 48
			text.textColor = 0x000000
			text.anchorOffsetX = text.width/2
			text.anchorOffsetY = text.height/2
			text.x = FlyConfig.stageWidth/2
			text.y = png.y + png.height*png.scaleY
			this.addChild(text);

			// 返回
			var enterGameBtn = new  egret.Bitmap();
            enterGameBtn.texture = RES.getRes(reason>0?"againBtn_png":"nextBtn_png");
            enterGameBtn.anchorOffsetX = enterGameBtn.width/2
            enterGameBtn.anchorOffsetY = enterGameBtn.height/2
            enterGameBtn.x = FlyConfig.stageWidth/2
            enterGameBtn.y = text.y + text.height*2 + 200;
            enterGameBtn.scaleX = enterGameBtn.scaleY = 2;
            this.addChild(enterGameBtn);
			this.enterGameBtn = enterGameBtn

			this.touchEnabled = true
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin,    this)
			this.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchClick,    this)
			this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchCancel,   this)
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchCancel,   this)
        }

		private onTouchBegin(evt:egret.TouchEvent) {
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY)){
                this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 1.8;
            }
        }

        private  onTouchClick(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
            if(this.enterGameBtn.hitTestPoint(evt.localX,evt.localY)){
				this.mgr.onClickBtn(this.reason)
            }
        }

        private  onTouchCancel(evt:egret.TouchEvent) {
            this.enterGameBtn.scaleX = this.enterGameBtn.scaleY = 2;
        }
	}
}