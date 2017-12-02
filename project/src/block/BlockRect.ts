module fly {
	export class BlockRect extends FlyRect {
		width:number
		height:number
		x:number
		y:number
		
		// 0:STATIC  1:DYNAMIC   2:KINEMATIC
		public constructor(x:number, y:number, width:number, height:number, op?) {
			super()
			this.layerIndex = 1
			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0
			})

			this.initShape(this.width, this.height)
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
			png.scaleX = this.width/png.width
			png.scaleY = this.height/png.height
			this.addChild(png)
		}
	}
}