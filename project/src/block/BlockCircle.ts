module fly {
	export class BlockCircle  extends FlyCircle {
		radius:number
		x:number
		y:number

		baseScale:number = 2
		
		// 0:STATIC  1:DYNAMIC   2:KINEMATIC
		public constructor(x:number, y:number, radius: number, op?) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius*2

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0
			})

			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block)

			this.initBitmap(op.path)
			this.updatePosition()

			this.setRotation(op.rotation)
		}

		private initBitmap(path:string)
		{
			if (path == null) return;
			
			let png = FlyTools.createBitmapByName(path)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.baseScale * this.radius/png.width
			png.scaleY = this.baseScale * this.radius/png.height
			this.addChild(png)
		}
	}
}