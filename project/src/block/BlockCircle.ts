module fly {
	export class BlockCircle  extends FlyCircle {
		radius:number
		x:number
		y:number
		
		// 0:STATIC  1:DYNAMIC   2:KINEMATIC
		public constructor(x:number, y:number, radius: number, op?) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:1
				, type:op.type || p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping
			})

			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block)

			this.initBitmap(op.path)
			this.updatePosition()
		}

		private initBitmap(path:string)
		{
			if (path == null) return;
			
			let png = FlyTools.createBitmapByName(path)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = 2 * this.radius/png.width
			png.scaleY = 2 * this.radius/png.height
			this.addChild(png)
		}
	}
}