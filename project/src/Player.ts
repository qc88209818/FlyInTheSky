module fly {
	export class Player extends FlyCircle {
		radius:number
		x:number
		y:number

		baseScale:number = FlyParam.PlayerBaseScale

		progress:UIProgress
		movieClip:egret.MovieClip
		force:number
		power:number
		mass:number
		step:number = 1

		inoperable:number = 0			// 不可操作状态
		heath:number = 3

		deadReason:string[] = ["", "你饿死了！", "你胖死了！", "你被陷阱杀死了！", "你太胖，摔死了！"]
		isListener:boolean  = false		// 是否被监听

		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius

			this.force = FlyParam.PlayerInitForce
			this.power = FlyParam.PlayerInitPower
			this.mass  = FlyParam.PlayerInitMass

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

		private dir:number = 1
		private weight:string = "normal"
		private nowState:string = "front_stand_normal"
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
			let weight = FlyParam.PlayerMoviePostfix[this.step]

			if (this.body.velocity[1] < 0 && x < y)
			{
				this.gotoAndPlay("black_move")
			}
			else if (this.body.velocity[1] > 0 && x < y)
			{
				this.gotoAndPlay("front_move")
			}
			else if (this.body.velocity[0] > 0 && x > y)
			{
				this.gotoAndPlaySide("side_move", 1)
			}
			else if (this.body.velocity[0] < 0 && x > y)
			{
				this.gotoAndPlaySide("side_move", -1)
			}

			if (x == 0 && y == 0)
			{
				if (this.nowState == "black_move" || this.nowState == "black_stand")
				{
					this.gotoAndPlay("black_stand")
				}
				else if (this.nowState == "front_move" || this.nowState == "front_stand")
				{
					this.gotoAndPlay("front_stand")
				}
				else if (this.nowState == "side_move" || this.nowState == "side_stand")
				{
					this.gotoAndPlaySide("side_stand", this.dir)
				}
			}
		}

		private gotoAndPlay(anim:string)
		{
			let weight = FlyParam.PlayerMoviePostfix[this.step]
			
			if (this.nowState == anim && this.weight == weight) return;
			this.movieClip.gotoAndPlay(anim + weight, -1)
			this.nowState = anim
			this.weight = weight

			console.log(this.nowState, this.weight)
		}

		private gotoAndPlaySide(anim:string, dir:number)
		{
			let weight = FlyParam.PlayerMoviePostfix[this.step]
			
			if (this.nowState == anim && this.weight == weight && this.dir == dir) return;
			this.movieClip.gotoAndPlay(anim + weight, -1)
			this.nowState = anim
			this.weight = weight
			this.dir = dir
			console.log(this.nowState, this.weight, this.dir)

			this.movieClip.scaleX = this.dir * this.baseScale * this.circle.radius/this.movieClip.width
		}

		public setVelocity(x:number, y:number)
		{
			if (this.inoperable > 0) return;
			this.body.velocity = [x*FlyParam.PlayerVelScale[this.step], y*FlyParam.PlayerVelScale[this.step]]
		}

		private initBitmap()
		{
			let png = new egret.MovieClip(this.objmgr.mcFactory.generateMovieClipData("playerState"));
			png.gotoAndPlay(this.nowState, -1)
			png.anchorOffsetX = png.width/2 + 8
			png.anchorOffsetY = png.height/8*7
			this.addChild(png)
			this.movieClip = png

			let progress = new UIProgress()
			progress.create(FlyParam.PlayerMaxPower, FlyParam.PlayerMinPower, FlyParam.PlayerInitPower)
			progress.anchorOffsetX = progress.width/2
			progress.anchorOffsetY = progress.height/2
			progress.visible = false
			this.progress = progress

			progress.setPosition(progress.width/2, progress.height)
		}

		public changePower(power:number)
		{
			this.power = power
			if (this.isListener)
			{
				this.objmgr.scene.dispatchEventWith("ChangePower", false, this.power)
			}

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
						this.mass  = FlyParam.PlayerInitMass*FlyParam.PlayerMassScale[i]
						this.force = FlyParam.PlayerInitForce*FlyParam.PlayerForceScale[i]

						this.circle.radius = this.radius * FlyParam.PlayerTijiScale[i]
						this.circle.updateArea()

						this.body.mass = this.mass
						this.body.updateMassProperties()

						this.movieClip.scaleX = this.dir * this.baseScale * this.circle.radius/this.movieClip.width
						this.movieClip.scaleY = this.baseScale * this.circle.radius/this.movieClip.height

						this.step = i

						this.changeRenderSize(this.circle.radius)
						this.updatePosition(0)
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

		public reset(x:number, y:number)
		{
			this.body.position = [x, y]
			this.body.velocity = [0, 0]
			this.nowState = ""
			this.weight = ""
			this.step = -1 

			this.changePower(FlyParam.PlayerInitPower)
		}

		public died(reason:number)
		{
			// 死亡原因
			console.log(this.deadReason[reason])
			this.heath -= 1
			this.reset(this.x, this.y)

			if (this.isListener)
			{
				this.objmgr.scene.dispatchEventWith("PlayerDead", false, this.deadReason[reason])
			}
		}

		public beginListener()
		{
			this.isListener = true
		}
	}
}