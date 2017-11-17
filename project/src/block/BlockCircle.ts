module fly {
	export class BlockCircle  extends FlyCircle {
		radius:number
		x:number
		y:number
		
		// 0:STATIC  1:DYNAMIC   2:KINEMATIC
		public constructor(x:number, y:number, radius: number, type:number) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:1
				, type:type || p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})

			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block)

			this.updatePosition()
		}

		public initBitmap(path:string)
		{
			let png = FlyTools.createBitmapByName(path)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = 2 * this.radius/png.width
			png.scaleY = 2 * this.radius/png.height
			this.addChild(png)
		}
	}
}