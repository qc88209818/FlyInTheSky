module fly {
	export class Player extends FlyRect {
		width:number
		height:number
		x:number
		y:number

		baseScale:number = 1.5

		progress:UIProgress
		render:egret.MovieClip
		power:number
		mass:number
		step:number = -1

		public constructor(x:number, y:number, width:number, height:number) {
			super()
			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height

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
			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Player, ObjectMask.Player)

			this.initBitmap()
			this.updatePosition()

			this.changePower(this.power)
		}

		private limitVel = 50
		private dir:number = 1
		private nowState:string = "front_move"
		public updatePosition()
		{
			super.updatePosition()

			let x = Math.abs(this.body.velocity[0])
			let y = Math.abs(this.body.velocity[1])
			let len = p2.vec2.len(this.body.velocity)

			if (this.body.velocity[1] < 0 && x < y)
			{
				if (len < this.limitVel)
				{
					if (this.nowState == "black_stand") return;
					this.render.gotoAndPlay("black_stand", -1)
					this.nowState = "black_stand"
				}
				else
				{
					if (this.nowState == "black_move") return;
					this.render.gotoAndPlay("black_move", -1)
					this.nowState = "black_move"
				}
			}
			else if (this.body.velocity[1] > 0 && x < y)
			{
				if (len < this.limitVel)
				{
					if (this.nowState == "front_stand") return;
					this.render.gotoAndPlay("front_stand", -1)
					this.nowState = "front_stand"
				}
				else
				{
					if (this.nowState == "front_move") return;
					this.render.gotoAndPlay("front_move", -1)
					this.nowState = "front_move"
				}
			}
			else if (this.body.velocity[0] > 0 && x > y)
			{
				this.dir = 1
				this.render.scaleX = this.baseScale * this.rect.width/this.render.width
				if (len < this.limitVel)
				{
					if (this.nowState == "side_stand_right") return;
					this.render.gotoAndPlay("side_stand", -1)
					this.nowState = "side_stand_right"
				}
				else
				{
					if (this.nowState == "side_move_right") return;
					this.render.gotoAndPlay("side_move", -1)
					this.nowState = "side_move_right"
				}
			}
			else if (this.body.velocity[0] < 0 && x > y)
			{
				this.dir = -1
				this.render.scaleX = -this.baseScale * this.rect.width/this.render.width
				if (len < this.limitVel)
				{
					if (this.nowState == "side_stand_left") return;
					this.render.gotoAndPlay("side_stand", -1)
					this.nowState = "side_stand_left"
				}
				else
				{
					if (this.nowState == "side_move_left") return;
					this.render.gotoAndPlay("side_move", -1)
					this.nowState = "side_move_left"
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
						this.rect.width = this.width * FlyParam.PlayerTijiScale[i]
						this.rect.height = this.height * FlyParam.PlayerTijiScale[i]
						this.rect.updateArea()

						this.body.mass = this.mass * FlyParam.PlayerMassScale[i]
						this.body.updateMassProperties()

						this.render.scaleX = this.dir * this.baseScale * this.rect.width/this.render.width
						this.render.scaleY = this.baseScale * this.rect.width/this.render.height

						this.changeRenderSize(this.rect.width, this.rect.height)

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
			png.scaleX = this.baseScale * this.width/png.width
			png.scaleY = this.baseScale * this.height/png.height
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