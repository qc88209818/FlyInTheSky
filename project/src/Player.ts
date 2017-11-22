module fly {
	export class Player extends FlyCircle {
		render:egret.MovieClip
		radius:number
		power:number
		mass:number
		step:number = -1
		x:number
		y:number

		progress:UIProgress

		public constructor(x:number, y:number, radius:number) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.power = FlyParam.PlayerInitPower
			this.mass = FlyParam.PlayerInitMass

			this.initBody({
				id:FlyConfig.getPlayerId()
				, mass:this.mass
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[x, y]
				, damping:0.8
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Player, ObjectMask.Player)

			this.initBitmap()
			this.updatePosition()

			this.changePower(this.power)
		}

		private dir:number = 1
		private nowState:string = "front_move"
		public updatePosition()
		{
			super.updatePosition()

			let x = Math.abs(this.body.velocity[0])
			let y = Math.abs(this.body.velocity[1])

			if (this.body.velocity[1] < 0 && x < y)
			{
				if (this.nowState == "black_move") return;
				this.render.gotoAndPlay("black_move", -1)
				this.nowState = "black_move"
			}
			else if (this.body.velocity[1] > 0 && x < y)
			{
				if (this.nowState == "front_move") return;
				this.render.gotoAndPlay("front_move", -1)
				this.nowState = "front_move"
			}
			else if (this.body.velocity[0] > 0 && x > y)
			{
				if (this.nowState == "side_move_right") return;
				this.render.gotoAndPlay("side_move", -1)
				this.dir = 1
				this.render.scaleX = this.dir * 2.2 * this.circle.radius/this.render.width
				this.nowState = "side_move_right"
			}
			else if (this.body.velocity[0] < 0 && x > y)
			{
				if (this.nowState == "side_move_left") return;
				this.render.gotoAndPlay("side_move", -1)
				this.dir = -1
				this.render.scaleX = this.dir * 2.2 * this.circle.radius/this.render.width
				this.nowState = "side_move_left"
			}
		}

		public setVisible(visible:boolean)
		{
			this.progress.visible = visible
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

						this.render.scaleX = this.dir * 2.2 * this.circle.radius/this.render.width
						this.render.scaleY = 2.2 * this.circle.radius/this.render.height

						this.changeRenderSize(this.circle.radius)

						this.step = i
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

		public setVelocity(x:number, y:number)
		{
			this.body.velocity = [x/this.body.mass, y/this.body.mass]
		}

		private initBitmap()
		{
			let png = new egret.MovieClip(this.objmgr.mcFactory.generateMovieClipData("normalState"));
			png.gotoAndPlay("front_stand", -1)
			png.anchorOffsetX = png.width/2 + 8
			png.anchorOffsetY = png.height/2 + 5
			png.scaleX = 2.2 * this.radius/png.width
			png.scaleY = 2.2 * this.radius/png.height
			this.addChild(png)
			this.render = png

			let progress = new UIProgress()
			progress.create(FlyParam.PlayerMaxPower, FlyParam.PlayerMinPower, FlyParam.PlayerInitPower)
			progress.anchorOffsetX = progress.width/2
			progress.anchorOffsetY = progress.height/2
			progress.visible = false
			this.addChild(progress)
			this.progress = progress

			progress.setPosition(progress.width/2, -100)
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