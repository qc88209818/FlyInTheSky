module fly {
	export class Player extends FlyCircle {
		radius:number
		power:number
		mass:number
		step:number = -1
		x:number
		y:number

		progress:UIProgress

		public constructor(x:number, y:number, radius:number) {
			super()
			this.x = x
			this.y = y
			this.radius = radius
			this.power = FlyParam.PlayerInitPower
			this.mass = FlyParam.PlayerInitMass

			this.initBody({
				id:FlyConfig.getPlayerId()
				, mass:this.mass
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[x, y]
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Player, ObjectMask.Player)

			this.initBitmap()
			this.updatePosition()

			this.changePower(this.power)
		}

		public changePower(power:number)
		{
			this.power = power
			this.progress.changeValue(this.power)

			// 1 饿死
			if (power < FlyParam.PlayerMinPower)
			{
				this.died(1)
				return
			}

			for(let i = 0; i < FlyParam.PlayerStep.length; ++i)
			{
				if (power <= FlyParam.PlayerStep[i])
				{
					if (this.step != i)
					{
						this.circle.radius = this.radius * FlyParam.PlayerTijiScale[i]
						this.circle.updateArea()

						this.body.mass = this.mass * FlyParam.PlayerMassScale[i]
						this.body.updateMassProperties()

						this.changeRenderSize(this.circle.radius)

						this.step = i

						// console.log("Chang Step: ", i, power)
					}
					return
				}
			}

			// 2 胖死
			if (power > FlyParam.PlayerMaxPower)
			{
				this.died(2)
				return
			}
		}

		private initBitmap()
		{
			let png = FlyTools.createBitmapByName("player_down_png")
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = 2 * this.radius/png.width
			png.scaleY = 2 * this.radius/png.height
			this.addChild(png)

			let progress = new UIProgress()
			progress.create(FlyParam.PlayerMaxPower, FlyParam.PlayerMinPower, FlyParam.PlayerInitPower)
			progress.anchorOffsetX = 0.5
			progress.anchorOffsetY = 0.5
			this.addChild(progress)

			progress.setPosition(0, -100)

			this.progress = progress
		}

		private initPower()
		{
		}

		public addPower(value:number)
		{
			this.power += value
			this.progress.changeValue(this.power)
		}

		public reset(x:number, y:number)
		{
			this.body.position = [x, y]
			this.body.velocity = [0, 0]
			this.body.force = [0, 0]
			this.changePower(FlyParam.PlayerInitPower)
		}

		public died(reason:number)
		{
			// 1 饿死
			// 2 胖死
			console.log("你死了！", reason)
			this.reset(this.x, this.y)
		}
	}
}