module fly {
	export class UIProgress {
		bg:egret.Bitmap
		fr:egret.Bitmap
		max:number
		min:number
		now:number

		private basescale:number = 2

		public constructor() {
		}

		public create(parentNode:egret.DisplayObjectContainer, max:number, min:number, now:number)
		{
			let bg = FlyTools.createBitmapByName("hp_bg_png")
			bg.anchorOffsetX = 0
			bg.anchorOffsetY = bg.height/2
			bg.scaleX = this.basescale
			bg.scaleY = this.basescale
			parentNode.addChild(bg)
			this.bg = bg

			let fr = FlyTools.createBitmapByName("hp_png")
			fr.anchorOffsetX = 0
			fr.anchorOffsetY = fr.height/2
			fr.scaleX = this.basescale
			fr.scaleY = this.basescale
			parentNode.addChild(fr)
			this.fr = fr

			this.max = max
			this.min = min
			this.now = now

			this.changeValue(now)
		}

		public setPosition(x:number, y:number)
		{
			this.bg.x = x
			this.bg.y = y

			this.fr.x = x
			this.fr.y = y
		}

		public changeValue(value:number)
		{
			let v = value
			v = Math.min(this.max, v)
			v = Math.max(this.min, v)
			this.now = v

			let scale = (v - this.min)/(this.max - this.min)
			this.fr.scaleX = this.basescale * scale
		}
	}
}