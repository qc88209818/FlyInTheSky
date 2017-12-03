module fly {
	export class AiTraps extends FlyCircle {
		x:number
		y:number
		radius:number
		op:any

		baseScale:number = FlyParam.AiBaseScale
		pRadius:number
		pVelocity:number

		private _soundName:string = ""

		private _dir:number = 1
		private _nowState:string = "front"
		private _movieClip:egret.MovieClip

		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.layerIndex = 4
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.pRadius = op.pRadius || radius*4
			this.pVelocity = op.pVelocity || FlyParam.forceScale/3
			this._soundName = op.sound || "dog.mp3"

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
			var png = new egret.MovieClip(this.objmgr.dogFactory.generateMovieClipData("dog"));
			png.gotoAndPlay("front", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height*0.8		
			png.scaleX = this.baseScale * this._dir
			png.scaleY = this.baseScale
			this.addChild(png)
			this._movieClip = png
		}

		public destroy()
		{
			super.destroy()
			SceneManager.inst().stopSound(this._soundName, this)
		}

		public onTrigger(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					this._movieClip.gotoAndPlay("attack", 1)
					this.body.velocity = [0, 0]
			
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

			let nowState = ""
			if (dist <= this.pRadius)
			{
				let dir = [player.body.position[0] - this.body.position[0], player.body.position[1] - this.body.position[1]]
				let normal = []
				p2.vec2.normalize(normal, dir)

				let forceScale = this.pVelocity
				this.body.velocity = [normal[0]*forceScale,  normal[1]*forceScale]

				SceneManager.inst().playSound(this._soundName, this)
			}
			else
			{
				this.body.velocity = [0, 0]
				SceneManager.inst().stopSound(this._soundName, this)
			}

			this.updateDir()
		}

		private updateDir()
		{
			let x = Math.abs(this.body.velocity[0])
			let y = Math.abs(this.body.velocity[1])
			if (this.body.velocity[1] < 0 && x < y)
			{
				this.gotoAndPlay("back")
			}
			else if (this.body.velocity[1] > 0 && x < y)
			{
				this.gotoAndPlay("front")
			}
			else if (this.body.velocity[0] > 0 && x >= y)
			{
				this.gotoAndPlaySide("right", 1)
			}
			else if (this.body.velocity[0] < 0 && x >= y)
			{
				this.gotoAndPlaySide("right", -1)
			}
		}

		private gotoAndPlay(anim:string)
		{
			if (this._nowState == anim) return;
			this._movieClip.gotoAndPlay(anim, -1)
			this._nowState = anim
		}

		private gotoAndPlaySide(anim:string, dir:number)
		{
			if (this._nowState == anim && this._dir == dir) return;
			this._movieClip.gotoAndPlay(anim, -1)
			this._nowState = anim
			this._dir = dir

			this._movieClip.scaleX = this.baseScale * this._dir
		}
	}
}