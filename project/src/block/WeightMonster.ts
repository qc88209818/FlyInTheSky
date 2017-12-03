module fly {
	export class WeightMonster extends FlyRect {
		x:number
		y:number
		width:number
		height:number

		baseScale:number = FlyParam.WeightBlockBaseScale

		max:number
		min:number

		private _soundName:string = ""

		private _dir:number = 1
		private _nowState:string = "stand"
		private _movieClip:egret.MovieClip
		
		public constructor(x:number, y:number, width:number, height:number, op?) {
			super()
			this.layerIndex = 3
			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height
			this.min = op.min || 0
			this.max = op.max || 999
			this._soundName = op.sound || "monster.mp3"

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:9999
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0.8
			})
			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block)

			this.initBitmap(op.path)
			this.updatePosition()

			this.setRotation(op.rotation)
		}

		private initBitmap(path:string)
		{
			var png = new egret.MovieClip(this.objmgr.monFactory.generateMovieClipData("monsterWall"));
			png.gotoAndPlay("stand", -1)
			png.anchorOffsetX = png.width*0.6
			png.anchorOffsetY = png.height*0.7		
			png.scaleX = this.baseScale * this._dir
			png.scaleY = this.baseScale
			this.addChild(png)
			this._movieClip = png

			this._movieClip.addEventListener(egret.Event.COMPLETE, this.afterMovieClip, this);
		}

		private afterMovieClip()
		{
			this._movieClip.gotoAndPlay("stand", -1)
			this._nowState = "stand"
		}

		public onContactBegin(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					let mass = 9999
					if (this.min < player.force && player.force < this.max)
						mass = 1

					if (this.body.mass != mass)
					{
						this.body.mass = mass
						this.body.updateMassProperties()
					}
					else if (mass == 9999 && this._nowState == "stand")
					{
						this._movieClip.gotoAndPlay("attack", 1)
						this._nowState = "attack"

						// 瘦的直接吓死
						if (player.power < FlyParam.PlayerStep[0])
						{
							player.hit([0, 0], -FlyParam.PlayerStep[0], 1)
						}
						// 其他减体重
						else
						{
							let normal = FlyTools.getDirect(player.body.position, this.body.position)
							let forceScale = FlyParam.forceScale
							player.hit([normal[0]*forceScale,  normal[1]*forceScale], FlyParam.hit_power, 1)
						}
					}

					return
				}
			})
		}

		public onContactEnd(pid:number)
		{
			this.body.mass = 9999
			this.body.updateMassProperties()
		}

		public updatePosition(dt:number = 0)
		{
			super.updatePosition(dt)
	
			let player = this.objmgr.scene.player
			let dist = p2.vec2.dist(player.body.position, this.body.position)

			let radius = (this.width + this.height)/2
			if (dist < radius * 2)
			{
				SceneManager.inst().playSound(this._soundName, this)
			}
			else
			{
				SceneManager.inst().stopSound(this._soundName, this)
			}
		}
	}
}

