module fly {
	export class FlyMusic {

		private _sound: egret.Sound = new egret.Sound()
		private _channel: egret.SoundChannel
		private _forever:boolean = false

		public constructor() {
		}

		// 加载音乐
		public loadMusic(path:string, forever:boolean = false)
		{
			this.stop();
			
			this._sound.load(path)
        	this._sound.addEventListener(egret.Event.COMPLETE, this.onLoad, this)
			this._forever = forever
		}

		//播放
		public play()
		{
			//sound 播放会返回一个 SoundChannel 对象，暂停、音量等操作请控制此对象
			this._channel = this._sound.play(0, this._forever?0:1);
			this._channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);
		}

		//停止
		public stop():void {
			if (this._channel) {
				this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);
				this._channel.stop();
				this._channel = null;
			}
		}

		private onLoad()
		{
			this._sound.removeEventListener(egret.Event.COMPLETE, this.onLoad, this)
			
			console.log("播放音乐")
			this.play()
		}

		//播放完成
		public onComplete()
		{
			console.log("播放完成")
			this.stop();
		}

		public playVictory()
		{
			this.loadMusic("resource/music/victory.mp3")
		}

		public playBgm(num:number)
		{
			this.loadMusic("resource/music/bgm" + num + ".mp3", true)
		}
	}
}