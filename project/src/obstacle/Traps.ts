module fly {
	export class Traps  extends FlyRect {
		x:number
		y:number
		width:number
		height:number
		dir:number
		delay:number
		op:any

		baseScale:number = FlyParam.TrapsBaseScale

		private _movieClip:egret.MovieClip
		private _nowstate:string = ""
		private _lasttime = 0
		private _finished = false
		
		public constructor(x:number, y:number, width:number, height:number, op?) {
			super()
			this.layerIndex = 2
			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height
			this.op  = op
			this.delay = op.delay || 4
			this.dir = op.dir || 1

			this.initBody({
				id:FlyConfig.getObstacleId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0.8
			})
			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Obstacle, ObjectMask.Obstacle)

			this.initBitmap(op.path)
			this.updatePosition()

			this.setRotation(op.rotation)
		}

		private initBitmap(path:string)
		{
			var png = new egret.MovieClip(this.objmgr.stabFactory.generateMovieClipData("stab"));
			png.gotoAndPlay("hide", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.baseScale * this.width/png.width * this.dir
			png.scaleY = this.baseScale * this.height/png.height
			this.addChild(png)
			this._movieClip = png
			this._nowstate = "hide"
			this._lasttime = this.delay

			this._movieClip.addEventListener(egret.Event.COMPLETE, this.afterMovieClip, this);
		}

		private afterMovieClip()
		{
			this._finished = true
		}

		public onTrigger(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid && this._nowstate != "hide")
				{
					player.died(3)
					return true
				}
			})
			return true
		}

		public updatePosition(dt:number = 0)
		{
			super.updatePosition(dt)
			if (this._lasttime > 0)
			{
				this._lasttime -= dt;
				return
			}

			this.nextState()
		}

		private nextState()
		{
			if (this._nowstate == "hide")
			{
				this._nowstate = "emerge"
				this._movieClip.gotoAndPlay(this._nowstate, 1)
			}
			else if (this._nowstate == "emerge" && this._finished)
			{
				this._nowstate = "show"
				this._movieClip.gotoAndPlay(this._nowstate, -1)
				this._lasttime = FlyParam.traps_show_time
				this._finished = false
			}
			else if (this._nowstate == "show")
			{
				this._nowstate = "retract"
				this._movieClip.gotoAndPlay(this._nowstate, 1)
			}
			else if (this._nowstate == "retract" && this._finished)
			{
				this._nowstate = "hide"
				this._movieClip.gotoAndPlay(this._nowstate, -1)
				this._lasttime = FlyParam.traps_hide_time
				this._finished = false
			}
		}
	}
}