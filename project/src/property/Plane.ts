module fly {
	export class Plane extends FlyCircle {
		x:number
		y:number
		radius:number
		dir:number
		op:any

		baseScale:number = FlyParam.PlaneBaseScale
		
		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.layerIndex = 5
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.op  = op
			this.dir = op.dir || 1

			this.initBody({
				id:FlyConfig.getPropertyId()
				, mass:1
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)
			
			this.initBitmap(op.path)
			this.updatePosition()
			
			this.setRotation(op.rotation)
		}

		private initBitmap(path:string)
		{
			if (path == null) return;
			
			let png = FlyTools.createBitmapByName(path)
			png.scaleX = this.baseScale * this.dir
			png.scaleY = this.baseScale
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			this.addChild(png)
		}

		public onTrigger(pid:number)
		{
			this.objmgr.scene.player.win()
			return true
		}
	}
}