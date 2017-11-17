module fly {
	export class Candy extends FlyCircle {
		x:number
		y:number
		radius:number
		delta:number
		
		public constructor(x:number, y:number, radius:number) {
			super()
			this.x = x + radius
			this.y = y + radius
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
			
			this.updatePosition()
		}

		public initBitmap(path:string)
		{
			let png = FlyTools.createBitmapByName(path)
			png.scaleX = 2 * this.radius/png.width
			png.scaleY = 2 * this.radius/png.height
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			this.addChild(png)
		}

		public onTrigger(pid:number)
		{
			this.isDestroy = true

			// delta后创建新的
			if (this.delta > 0)
			{
				egret.setTimeout(function () {              
					let candy = new Candy(this.x, this.y, this.radius)
					candy.setDelta(this.delta)
					this.objmgr.scene.addToWorld(candy)
				}, this, this.delta*1000); 
			}
			
			// 减少能量
			this.objmgr.players.forEach(value => {
				if (value.body.id == pid)
				{
					value.addPower(FlyParam.candy_power)
					return
				}
			})
		}

		public setDelta(delta:number)
		{
			this.delta = delta
		}
	}
}