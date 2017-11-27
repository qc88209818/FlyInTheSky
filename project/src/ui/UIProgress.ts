module fly {
	export class UIProgress extends egret.DisplayObjectContainer{
		bg:egret.Bitmap
		fr:egret.Bitmap
		max:number
		min:number
		now:number

		public constructor() {
			super()
		}

		public create(max:number, min:number, now:number)
		{
        	let wid = FlyConfig.stageWidth - 10

			let bg = FlyTools.createBitmapByName("hp_bg_png")
			bg.anchorOffsetX = 0
			bg.anchorOffsetY = bg.height/2
			bg.width = wid
			bg.height = bg.height*2
			this.addChild(bg)
			this.bg = bg

			let fr = FlyTools.createBitmapByName("hp_png")
			fr.anchorOffsetX = 0
			fr.anchorOffsetY = fr.height/2
			fr.width = wid - 10
			fr.height = fr.height*2
			this.addChild(fr)
			this.fr = fr

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