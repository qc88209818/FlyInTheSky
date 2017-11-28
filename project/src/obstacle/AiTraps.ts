module fly {
	export class AiTraps extends FlyCircle {
		x:number
		y:number
		radius:number
		op:any

		baseScale:number = FlyParam.AiBaseScale
		lookRadius:number
		lookVelocity:number
		
		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.lookRadius = op.lookRadius || radius*4
			this.lookVelocity = op.lookVelocity || FlyParam.forceScale/3

			this.initBody({
				id:FlyConfig.getAiPlayerId()
				, mass:1
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0.7
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.AiPlayer, ObjectMask.AiPlayer)

			this.initBitmap(op.path)
			this.updatePosition()
		}

		private initBitmap(path:string)
		{
			let png = FlyTools.createBitmapByName(path)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.baseScale * this.radius/png.width
			png.scaleY = this.baseScale * this.radius/png.height
			this.addChild(png)
		}

		public onTrigger(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					player.died(5)
					return true
				}
			})
			return true
		}

		public updatePosition(dt:number = 0)
		{
			super.updatePosition(dt)
			
			let player = this.objmgr.scene.player
			let dist = p2.vec2.dist(player.body.position, this.body.position)

			if (dist <= this.lookRadius)
			{
				let dir = [player.body.position[0] - this.body.position[0], player.body.position[1] - this.body.position[1]]
				let normal = []
				p2.vec2.normalize(normal, dir)

				let forceScale = this.lookVelocity
				this.body.velocity = [normal[0]*forceScale,  normal[1]*forceScale]
			}
			else
			{
				this.body.velocity = [0, 0]
			}
		}
	}
}