module fly {
	export class BlockRect extends FlyRect {
		width:number
		height:number
		x:number
		y:number
		
		// 0:STATIC  1:DYNAMIC   2:KINEMATIC
		public constructor(x:number, y:number, width:number, height:number, type:number) {
			super()

			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:1
				, type:type || p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})

			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block)

			this.updatePosition()
		}

		public initBitmap(path:string)
		{
			let png = FlyTools.createBitmapByName(path)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.width/png.width
			png.scaleY = this.height/png.height
			this.addChild(png)
		}
	}
}