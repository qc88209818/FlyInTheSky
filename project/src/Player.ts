module fly {
	export class Player extends FlyCircle {
		radius:number
		x:number
		y:number

		baseScale:number = 2

		progress:UIProgress
		movieClip:egret.MovieClip
		power:number
		mass:number
		step:number = -1

		inoperable:number = 0			// 不可操作状态
		windyVel:number[] = [0, 0]		// 外力影响

		public constructor(x:number, y:number, radius:number, op?) {
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
			this.updatePosition(0)

			this.changePower(this.power)
		}

		private limitVel = 50
		private dir:number = 1
		private nowState:string = ""
		public updatePosition(dt:number = 0)
		{
			super.updatePosition(dt)

			// 僵直时间
			if (this.inoperable > 0)
			{
				this.inoperable -= dt;
			}

			let x = Math.abs(this.body.velocity[0])
			let y = Math.abs(this.body.velocity[1])

			if (this.body.velocity[1] < 0 && x < y)
			{
				if (this.nowState == "black_move") return;
				this.movieClip.gotoAndPlay("black_move", -1)
				this.nowState = "black_move"
			}
			else if (this.body.velocity[1] > 0 && x < y)
			{
				if (this.nowState == "front_move") return;
				this.movieClip.gotoAndPlay("front_move", -1)
				this.nowState = "front_move"
			}
			else if (this.body.velocity[0] > 0 && x > y)
			{
				if (this.nowState == "side_move_right") return;

				this.dir = 1
				this.movieClip.scaleX = this.baseScale * this.circle.radius/this.movieClip.width
				
				this.movieClip.gotoAndPlay("side_move", -1)
				this.nowState = "side_move_right"
			}
			else if (this.body.velocity[0] < 0 && x > y)
			{
				if (this.nowState == "side_move_left") return;
				this.movieClip.gotoAndPlay("side_move", -1)
				this.nowState = "side_move_left"

				this.dir = -1
				this.movieClip.scaleX = -this.baseScale * this.circle.radius/this.movieClip.width
			}

			if (x == 0 && y == 0)
			{
				if (this.nowState == "black_move")
				{
					this.movieClip.gotoAndPlay("black_stand", -1)
					this.nowState = "black_stand"
				}
				else if (this.nowState == "front_move")
				{
					this.movieClip.gotoAndPlay("front_stand", -1)
					this.nowState = "front_stand"
				}
				else if (this.nowState == "side_move_right")
				{
					this.movieClip.gotoAndPlay("side_stand", -1)
					this.nowState = "side_stand_right"
				}
				else if (this.nowState == "side_move_left")
				{
					this.movieClip.gotoAndPlay("side_stand", -1)
					this.nowState = "side_stand_left"
				}
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

						this.movieClip.scaleX = this.dir * this.baseScale * this.circle.radius/this.movieClip.width
						this.movieClip.scaleY = this.baseScale * this.circle.radius/this.movieClip.height

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
			if (this.inoperable > 0) return;

			this.body.velocity = [x/this.body.mass - this.windyVel[0], y/this.body.mass - this.windyVel[1]]
		}

		private initBitmap()
		{
			let png = new egret.MovieClip(this.objmgr.mcFactory.generateMovieClipData("normalState"));
			png.gotoAndPlay("front_stand", -1)
			png.anchorOffsetX = png.width/2 + 8
			png.anchorOffsetY = png.height/8*7
			png.scaleX = this.baseScale * this.radius/png.width
			png.scaleY = this.baseScale * this.radius/png.height
			this.addChild(png)
			this.movieClip = png

			let progress = new UIProgress()
			progress.create(FlyParam.PlayerMaxPower, FlyParam.PlayerMinPower, FlyParam.PlayerInitPower)
			progress.anchorOffsetX = progress.width/2
			progress.anchorOffsetY = progress.height/2
			progress.visible = false
			this.addChild(progress)
			this.progress = progress

			progress.setPosition(progress.width/2, -png.height*this.baseScale)
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