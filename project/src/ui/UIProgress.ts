module fly {
	export class UIProgress extends egret.DisplayObjectContainer{
		bg:egret.Bitmap
		fr:egret.Bitmap
		max:number
		min:number
		now:number

		private basescale:number = 0.5

		public constructor() {
			super()
		}

		public create(max:number, min:number, now:number)
		{
			let bg = FlyTools.createBitmapByName("hp_bg_png")
			bg.anchorOffsetX = 0
			bg.anchorOffsetY = bg.height/2
			bg.scaleX = this.basescale
			this.addChild(bg)
			this.bg = bg

			let fr = FlyTools.createBitmapByName("hp_png")
			fr.anchorOffsetX = 0
			fr.anchorOffsetY = fr.height/2
			fr.scaleX = this.basescale
			this.addChild(fr)
			this.fr = fr

			this.max = max
			this.min = min
			this.now = now

			this.changeValue(now)
		}

		public setPosition(x:number, y:number)
		{
			this.bg.x = -this.bg.width/2*this.basescale + x
			this.bg.y = y

			this.fr.x = -this.fr.width/2*this.basescale + x
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