module fly {
	export class Player extends FlyCircle {
		radius:number
		x:number
		y:number

		baseScale:number = FlyParam.PlayerBaseScale

		movieClip:egret.MovieClip
		dieMovieClip:egret.MovieClip
		powerText:egret.TextField

		force:number
		power:number
		mass:number
		step:number = 1

		reason:number = 0
		inoperable:number = 0			// 不可操作状态
		isListener:boolean  = false		// 是否被监听
		addPowerTime:number  = 0		// 是否飘字

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

			this.updateMovieClip(dt)
			this.updatePowerFly(dt)
		}

		private updateMovieClip(dt:number)
		{
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
			else if (this.body.velocity[0] > 0 && x >= y)
			{
				this.gotoAndPlaySide("side_move", 1)
			}
			else if (this.body.velocity[0] < 0 && x >= y)
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

		private updatePowerFly(dt:number)
		{
			// 飘字动画
			if (this.addPowerTime > 0 && this.powerText.textColor == 0xFFA500)
			{
				this.powerText.x = this.body.position[0] + 20
				this.powerText.y = this.body.position[1] - 150 + this.addPowerTime*50
				this.powerText.alpha = this.addPowerTime/2
				this.addPowerTime -= dt
			}
			else if (this.addPowerTime > 0 && this.powerText.textColor == 0x3399FF)
			{
				this.powerText.x = this.body.position[0] + 20
				this.powerText.y = this.body.position[1] - 50 - this.addPowerTime*50
				this.powerText.alpha = this.addPowerTime/2
				this.addPowerTime -= dt
			}
			else if (this.powerText)
			{
				this.powerText.visible = false
			}
		}

		private gotoAndPlay(anim:string)
		{
			let weight = FlyParam.PlayerMoviePostfix[this.step]
			
			if (this.nowState == anim && this.weight == weight) return;
			this.movieClip.gotoAndPlay(anim + weight, -1)
			this.nowState = anim
			this.weight = weight
		}

		private gotoAndPlaySide(anim:string, dir:number)
		{
			let weight = FlyParam.PlayerMoviePostfix[this.step]
			
			if (this.nowState == anim && this.weight == weight && this.dir == dir) return;
			this.movieClip.gotoAndPlay(anim + weight, -1)
			this.nowState = anim
			this.weight = weight
			this.dir = dir

			this.movieClip.scaleX = this.baseScale * FlyParam.PlayerTijiScale[this.step] * this.dir
		}

		public setVelocity(x:number, y:number)
		{
			if (this.inoperable > 0) return;
			this.body.velocity = [x*FlyParam.PlayerVelScale[this.step], y*FlyParam.PlayerVelScale[this.step]]
		}

		private initBitmap()
		{
			var png = new egret.MovieClip(this.objmgr.mcFactory.generateMovieClipData("playerState"));
			png.gotoAndPlay(this.nowState, -1)
			png.anchorOffsetX = png.width/2 + 8
			png.anchorOffsetY = png.height - 20
			this.addChild(png)
			this.movieClip = png

			var png = new egret.MovieClip(this.objmgr.dieFactory.generateMovieClipData("playerDie"));
			png.visible = false
			png.anchorOffsetX = png.width/2 + 23
			png.anchorOffsetY = png.height - 20
			this.addChild(png)
			this.dieMovieClip = png

			// 飘字
			var text:egret.TextField = new egret.TextField()
			text.visible = false
			text.text = "+" + 10
			text.size = 60;
			text.textColor = 0xFFA500
			this.addChild(text);
			this.powerText = text

			this.dieMovieClip.addEventListener(egret.Event.COMPLETE, this.afterMovieClip, this);
		}

		public addPower(power:number)
		{
			this.addPowerMovie(power)
			this.changePower(this.power + power)
		}

		public changePower(power:number)
		{
			this.power = power
			if (this.isListener && this.objmgr.scene)
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

						this.circle.radius = this.radius * FlyParam.PlayerRadiusScale[i]
						this.circle.updateArea()

						this.body.mass = this.mass
						this.body.updateMassProperties()

						this.movieClip.scaleX = this.baseScale * FlyParam.PlayerTijiScale[i] * this.dir
						this.movieClip.scaleY = this.baseScale * FlyParam.PlayerTijiScale[i]

						this.dieMovieClip.scaleX = this.baseScale * FlyParam.PlayerTijiScale[i]
						this.dieMovieClip.scaleY = this.baseScale * FlyParam.PlayerTijiScale[i]

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

		public beginListener()
		{
			this.isListener = true
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
			if (this.isDestroy) return
			this.isDestroy = true

			this.reason = reason<=2?reason:(this.step==0?1:2)
			this.dieMovieClip.visible = true
			this.movieClip.visible = false
			this.dieMovieClip.gotoAndPlay("die"+this.reason, 1)

			if (this.isListener)
			{
				this.objmgr.scene.stop()
				SceneManager.inst().music.playObject("defeated.mp3", 1)
			}
		}

		public win()
		{
			if (this.isDestroy) return
			this.isDestroy = true

			this.reason = 0
			if (this.isListener)
			{
				this.objmgr.scene.stop()
				SceneManager.inst().music.playObject("victory.mp3", 1)
				this.afterMovieClip()
			}
		}

		private afterMovieClip()
		{
			if (this.isListener)
			{
				this.objmgr.scene.delPlayerToWorld(this)
				this.objmgr.scene.isRunning = this.reason
			}
			else
			{
				this.reset(this.x, this.y)
			}
		}

		private addPowerMovie(power:number)
		{
			this.addPowerTime = 2
			this.powerText.visible = true

			if (power > 0)
			{
				this.powerText.text = "+" + power
				this.powerText.textColor = 0xFFA500
			}
			else
			{
				this.powerText.text = "" + power
				this.powerText.textColor = 0x3399FF
			}
		}
	}
}