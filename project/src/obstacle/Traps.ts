module fly {
	export class Traps  extends FlyRect {
		x:number
		y:number
		width:number
		height:number
		
		public constructor(x:number, y:number, width:number, height:number) {
			super()
			this.x = x
			this.y = y
			this.width = width
			this.height = height

			this.initBody({
				id:FlyConfig.getPropertyId()
				, mass:1
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})
			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)

			this.initBitmap()
			this.updatePosition()
		}

		private initBitmap()
		{
			let png = FlyTools.createBitmapByName("mushroom_png")
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.width/png.width
			png.scaleY = this.height/png.height
			this.addChild(png)
		}

		public onTrigger()
		{
			this.isDestroy = true
			this.objmgr.player.died(3)
		}
	}
}