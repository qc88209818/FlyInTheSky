module fly {
	export class BattleTouchLayer extends egret.DisplayObjectContainer {
		virtualBg:egret.Bitmap;
		virtualBtn:egret.Bitmap;
		forceScale:number;		// 加速因子
		maxDist:number;			// 最大移动距离
		direct:number[] = [];
		isTouchMove:boolean = false;

		parentNode:egret.DisplayObjectContainer;

		public constructor(parentNode:egret.DisplayObjectContainer, maxDist:number, forceScale:number) {
			super();
			this.parentNode = parentNode;
			this.maxDist = maxDist;
			this.forceScale = forceScale;

			this.createTouchLayer();
		}

		private createTouchLayer()
		{
			let background = new egret.Shape();
			background.graphics.beginFill(0x000000, 1);
			background.graphics.drawRect(0, 0, FlyConfig.stageWidth, FlyConfig.stageHeight);
			background.graphics.endFill();
			this.parentNode.addChildAt(background, 0)

			background.touchEnabled = true;
			background.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			background.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchEnd,   this);
			background.addEventListener(egret.TouchEvent.TOUCH_MOVE,  this.onTouchMove,  this);
			background.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchEnd,   this);
			background.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchEnd,   this);

			let bg = FlyTools.createBitmapByName("virtual_background_png");
			bg.alpha = 0;
			bg.scaleX = 0.5;
			bg.scaleY = 0.5;
			bg.anchorOffsetX = bg.width/2;
			bg.anchorOffsetY = bg.height/2;
			this.virtualBg = bg;
			this.parentNode.addChildAt(bg, 100)

			let btn = FlyTools.createBitmapByName("virtual_button_png");
			btn.alpha = 0;
			btn.scaleX = 0.5;
			btn.scaleY = 0.5;
			btn.anchorOffsetX = btn.width/2;
			btn.anchorOffsetY = btn.height/2;
			this.virtualBtn = btn;
			this.parentNode.addChildAt(btn, 101)
		}

		private onTouchBegin(evt:egret.TouchEvent) {
			this.virtualBg.x = evt.stageX;
			this.virtualBg.y = evt.stageY;
			this.virtualBg.alpha = 0.5;

			this.virtualBtn.x = evt.stageX;
			this.virtualBtn.y = evt.stageY;
			this.virtualBtn.alpha = 0.5;
		}

		private onTouchEnd(evt:egret.TouchEvent) {
			this.virtualBg.alpha = 0;
			this.virtualBtn.alpha = 0;

			this.isTouchMove = false;
		}

		private onTouchMove(evt:egret.TouchEvent) {
			let from = [this.virtualBg.x, this.virtualBg.y];
			let to = [evt.stageX, evt.stageY];

			let direct = [(to[0]-from[0]), (to[1]-from[1])];
			let normal = [];
			p2.vec2.normalize(normal, direct);

			let dist = p2.vec2.distance(to, from);
			if (dist > this.maxDist) 
			{
				dist = this.maxDist;
			}

			this.direct[0] = normal[0]*dist;
			this.direct[1] = normal[1]*dist;

			this.virtualBtn.x = from[0] + this.direct[0];
			this.virtualBtn.y = from[1] + this.direct[1];
			this.isTouchMove = true;
		}
	}
}