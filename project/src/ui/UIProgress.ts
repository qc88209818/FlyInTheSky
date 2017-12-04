module fly {
	export class UIProgress extends egret.DisplayObjectContainer{
		bg:egret.Bitmap
		fr:egret.Bitmap
		fat:egret.Bitmap
		thin:egret.Bitmap
		text:egret.TextField

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
			bg.height = FlyConfig.stageHeight*0.5
			bg.anchorOffsetX = bg.width/2
			bg.anchorOffsetY = bg.height/2
			bg.scale9Grid = new egret.Rectangle(30, 100, 5, 100)
			this.addChild(bg)
			this.bg = bg

			let fr = FlyTools.createBitmapByName("progress_bar_png")
			fr.height = FlyConfig.stageHeight*0.5
			fr.anchorOffsetX = fr.width/2
			fr.anchorOffsetY = fr.height/2
			fr.scale9Grid = new egret.Rectangle(30, 100, 5, 100)
			this.addChild(fr)
			this.fr = fr

			let mk = new egret.Rectangle(0, 0, fr.width, fr.height)
			mk.x = fr.x
			mk.y = fr.y
			fr.mask = mk

			// 瘦图标
			let thin = FlyTools.createBitmapByName("thinPoint_png")
			thin.anchorOffsetX = thin.width/2
			thin.anchorOffsetY = thin.height/2
			thin.scaleX = 1.2
			thin.scaleY = 1.2
			this.addChild(thin)
			this.thin = thin

			// 胖图标
			let fat = FlyTools.createBitmapByName("fatPoint_png")
			fat.anchorOffsetX = fat.width/2
			fat.anchorOffsetY = fat.height/2
			fat.scaleX = 1.2
			fat.scaleY = 1.2
			this.addChild(fat)
			this.fat = fat

			// 显示关卡
			var text:egret.TextField = new egret.TextField()
			text.text = "" + now
			text.size = 32
			text.stroke = 2
        	text.strokeColor = 0x000000
			text.textColor = 0xFFFFFF
			text.anchorOffsetX = text.width/2
			text.anchorOffsetY = text.height/2
			this.addChild(text);
			this.text = text

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

			this.fat.x  = x
			this.thin.x = x
			this.text.x = x
		}

		public changeValue(value:number)
		{
			let v = value
			v = Math.min(this.max, v)
			v = Math.max(this.min, v)
			this.now = v

			let scale = (v - this.min)/(this.max - this.min)
			this.fr.mask.y = this.fr.height * (1 - scale)

			this.fat.y  = this.fr.mask.y + this.fr.height/2
			this.thin.y = this.fr.mask.y + this.fr.height/2

			this.text.text = "" + this.now
			this.text.y = this.fr.mask.y + this.fr.height/2
			this.text.anchorOffsetX = this.text.width/2

			this.thin.visible = 30<v&&v<70
			this.fat.visible = !this.thin.visible
		}
	}
}