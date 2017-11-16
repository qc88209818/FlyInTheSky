module fly {
	export class Candy extends FlyCircle {
		x:number
		y:number
		radius:number
		delta:number
		
		public constructor(x:number, y:number, radius:number) {
			super()
			this.x = x
			this.y = y
			this.radius = radius
			this.delta = 0

			this.initBody({
				id:FlyConfig.getPropertyId()
				, mass:1
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)

			this.initBitmap()
			this.updatePosition()
		}

		private initBitmap()
		{
			let png = FlyTools.createBitmapByName("candy_png")
			png.scaleX = 2 * this.radius/png.width
			png.scaleY = 2 * this.radius/png.height
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			this.addChild(png)
		}

		public onTrigger()
		{
			this.isDestroy = true
			this.objmgr.player.addPower(FlyParam.candy_power)

			// delta后创建新的
			egret.setTimeout(function () {              
                let candy = new Candy(this.x, this.y, this.radius)
				candy.setDelta(this.delta)
				this.objmgr.scene.addToWorld(candy)
			}, this, this.delta*1000); 
		}

		public setDelta(delta:number)
		{
			this.delta = delta
		}
	}
}