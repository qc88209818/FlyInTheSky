module fly {
	export class WindTraps extends FlyCircle {
		x:number
		y:number
		radius:number
		op:any

		max:number
		min:number

		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.op  = op
			this.min = op.min || 0
			this.max = op.max || 999

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

		public onTrigger(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					if (this.min < player.body.mass && player.body.mass < this.max)
					{
						let dir = [player.body.position[0] - this.x, player.body.position[1] - this.y]
						let normal = []
						p2.vec2.normalize(normal, dir)

						let forceScale = FlyParam.forceScale
						player.setVelocity(normal[0]*forceScale,  normal[1]*forceScale)
						player.inoperable = 1
					}
					return true
				}
			})
			return true
		}
	}
}