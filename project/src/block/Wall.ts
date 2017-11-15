module fly {
	export class Wall extends FlyRect {
		width:number
		height:number
		x:number
		y:number
		
		public constructor(x:number, y:number, width:number, height:number) {
			super()

			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:1
				, type:p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})

			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block)

			this.initBitmap()
			this.updatePosition()
		}

		private initBitmap()
		{
			// let png = FlyTools.createBitmapByName("candy_png")
			// png.anchorOffsetX = png.width/2
			// png.anchorOffsetY = png.height/2
			// png.scaleX = 2 * this.radious/png.width
			// png.scaleY = 2 * this.radious/png.height
			// this.addChild(png)
		}
	}
}