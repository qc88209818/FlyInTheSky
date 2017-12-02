 /**
* 物体基类
* @param x 左上角的 x 坐标。
* @param y 左上角的 y 坐标。
* @param type 物体的形状。
*/
module fly {
	export class FlyObject {
		body:p2.Body
		shape:p2.Shape

		layerIndex:number = 0
		isDestroy:boolean = false
		indexOf:number = -1

		objmgr:ObjectManager = ObjectManager.inst()

		public initBody(bodyOp?)
		{
			let body = new p2.Body(bodyOp)
			this.body = body
		}

		public updatePosition(dt:number = 0)
		{
			if (this.body)
			{
				this.body.displays.forEach(value => {
					value.x = this.body.position[0]
					value.y = this.body.position[1]
				})

				if (!fly.FlyConfig.DebugMode)
					return

				if (this.body.sleepState == p2.Body.SLEEPING)
				{
					this.body.displays[0].alpha = 0.5
				}
				else
				{
					this.body.displays[0].alpha = 1
				}
			}
		}

		public setGroupAndMask(group:number, mask:number)
		{
			if (this.shape)
			{
				this.shape.collisionGroup = group
				this.shape.collisionMask = mask
			}
		}

		public addChild(child:any)
		{
			if (!this.body.displays)
			{
				this.body.displays = []
			}
			this.body.displays.push(child)
		}

		public onTrigger(pid:number):boolean
		{
			// console.log("FlyObject onTrigger: ", pid)
			return false
		}

		public onContactBegin(pid:number)
		{
			// console.log("FlyObject onContactBegin: ", pid)
		}

		public onContactEnd(pid:number)
		{
			// console.log("FlyObject onContactEnd: ", pid)
		}

		public destroy()
		{
			this.isDestroy = true
		}
	}
}