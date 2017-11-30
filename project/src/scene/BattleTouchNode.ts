module fly {
	export class BattleTouchNode extends egret.DisplayObjectContainer {
		virtualBg:egret.Bitmap
		virtualBtn:egret.Bitmap
		maxDist:number			// 最大移动距离
		direct:number[] = []
		normal:number[] = []
		isTouchMove:boolean = false
		background:egret.Shape

		parentNode:egret.DisplayObjectContainer

		public constructor(parentNode:egret.DisplayObjectContainer, maxDist:number) {
			super()
			this.parentNode = parentNode
			this.maxDist = maxDist

			this.createTouchLayer()
		}

		public setTouchEnable(enable:boolean)
		{
			this.background.touchEnabled = enable
			if (!enable)
			{
				this.onTouchEnd(null)
			}
		}

		private createTouchLayer()
		{
			let background = new egret.Shape()
			background.graphics.beginFill(0x555555, 1)
			background.graphics.drawRect(0, 0, FlyConfig.stageWidth, FlyConfig.stageHeight)
			background.graphics.endFill()
			this.background = background
			this.parentNode.addChildAt(background, 0)

			background.touchEnabled = true
			background.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this)
			background.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchEnd,   this)
			background.addEventListener(egret.TouchEvent.TOUCH_MOVE,  this.onTouchMove,  this)
			background.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchEnd,   this)
			background.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchEnd,   this)

			let bg = FlyTools.createBitmapByName("virtual_background_png")
			bg.alpha = 0
			bg.scaleX = 1.2
			bg.scaleY = 1.2
			bg.anchorOffsetX = bg.width/2
			bg.anchorOffsetY = bg.height/2
			this.virtualBg = bg
			this.parentNode.addChildAt(bg, 100)

			let btn = FlyTools.createBitmapByName("virtual_button_png")
			btn.alpha = 0
			btn.scaleX = 0.5
			btn.scaleY = 0.5
			btn.anchorOffsetX = btn.width/2
			btn.anchorOffsetY = btn.height/2
			this.virtualBtn = btn
			this.parentNode.addChildAt(btn, 101)
		}

		private onTouchBegin(evt:egret.TouchEvent) {
			this.virtualBg.x = 450
			this.virtualBg.y = 1300
			this.virtualBg.alpha = 0.5

			this.virtualBtn.x = 450
			this.virtualBtn.y = 1300
			this.virtualBtn.alpha = 0.5
		}

		private onTouchEnd(evt:egret.TouchEvent) {
			this.virtualBg.alpha = 0
			this.virtualBtn.alpha = 0

			this.isTouchMove = false
		}

		private onTouchMove(evt:egret.TouchEvent) {
			let from = [this.virtualBg.x, this.virtualBg.y]
			let to = [evt.stageX, evt.stageY]

			let direct = [(to[0]-from[0]), (to[1]-from[1])]
			p2.vec2.normalize(this.normal, direct)

			this.normal = this.normal8dir(this.normal)

			this.direct[0] = this.normal[0]*this.maxDist
			this.direct[1] = this.normal[1]*this.maxDist

			this.virtualBtn.x = from[0] + this.direct[0]
			this.virtualBtn.y = from[1] + this.direct[1]
			this.isTouchMove = true
		}

		private normal8dir(dir:number[]):number[]
		{
			let out = [0, 0]

			let tmp = Math.sqrt(2)/2
			let angle = Math.acos(dir[0])/Math.PI*180
			if (dir[1] < 0)
				angle = 360 - angle

			if (angle >= -22.5 + 360 || angle < 22.5)
			{
				out = [1, 0]
			}
			else if (angle >= -22.5 + 315)
			{
				out = [tmp, -tmp]
			}
			else if (angle >= -22.5 + 270)
			{
				out = [0 , -1]
			}
			else if (angle >= -22.5 + 225)
			{
				out = [-tmp, -tmp]
			}
			else if (angle >= -22.5 + 180)
			{
				out = [-1, 0]
			}
			else if (angle >= -22.5 + 135)
			{
				out = [-tmp, tmp]
			}
			else if (angle >= -22.5 + 90)
			{
				out = [0, 1]
			}
			else if (angle >= -22.5 + 45)
			{
				out = [tmp, tmp]
			}
			else
			{
				out = dir
			}

			return out
		}
	}
}