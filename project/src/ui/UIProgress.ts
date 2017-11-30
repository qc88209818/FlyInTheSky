module fly {
	export class UIProgress extends egret.DisplayObjectContainer{
		bg:egret.Bitmap
		fr:egret.Bitmap
		mk:egret.Bitmap
		max:number
		min:number
		now:number

		public constructor() {
			super()
		}

		public create(max:number, min:number, now:number)
		{
        	let wid = FlyConfig.stageWidth - 10

			let bg = FlyTools.createBitmapByName("progress_bar_background_png")
			bg.anchorOffsetX = 0
			bg.anchorOffsetY = bg.height/2
			bg.width = wid
			bg.height = bg.height*2
			this.addChild(bg)
			this.bg = bg

			let fr = FlyTools.createBitmapByName("progress_bar_png")
			fr.anchorOffsetX = 0
			fr.anchorOffsetY = fr.height/2
			fr.width = wid
			fr.height = fr.height*2 + 10
			this.addChild(fr)
			this.fr = fr

			let mk = FlyTools.createBitmapByName("progress_bar_frame_png")
			mk.anchorOffsetX = 0
			mk.anchorOffsetY = mk.height/2
			mk.width = wid
			mk.height = mk.height*2
			this.addChild(mk)
			this.mk = mk

			this.max = max
			this.min = min
			this.now = now

			this.changeValue(now)
		}

		public setPosition(x:number, y:number)
		{
			this.bg.x = x + 5
			this.bg.y = y

			this.fr.x = x + 10
			this.fr.y = y + 2

			this.mk.x = x + 5
			this.mk.y = y
		}

		public changeValue(value:number)
		{
			let v = value
			v = Math.min(this.max, v)
			v = Math.max(this.min, v)
			this.now = v

			let scale = (v - this.min)/(this.max - this.min)
			this.fr.scaleX = scale
		}
	}
}