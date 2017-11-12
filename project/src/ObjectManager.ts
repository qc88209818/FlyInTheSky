module fly {
	export class ObjectManager {
		static obj:ObjectManager = new ObjectManager();
		public static inst(): ObjectManager
		{
			return this.obj;
		}

		player:Player;
		sprites:FlyObject[] = [];		// 当前所有需要计算位置的精灵
	
		public update(dt:number)
		{
			let length = this.sprites.length;
			for(let i = 0; i < length;)
			{
				if (!this.sprites[i].isDestroy)
				{
					this.sprites[i].updatePosition();
					++i;
				}
				else
				{
					console.log("Delete: ", this.sprites[i].body.id);
					--length;
					this.sprites[i].indexOf = -1;
					this.sprites[i] = this.sprites[length];
					this.sprites[i].indexOf = i;
					this.sprites.pop();
				}
			}
		}

		public addSprite(obj:FlyObject)
		{
			obj.indexOf = this.sprites.length;
			this.sprites.push(obj);
		}

		public delSprite(obj:FlyObject)
		{
			obj.isDestroy = true;
		}

		public delSpriteImmediate(obj:FlyObject)
		{
			obj.isDestroy = true;
			
			let index = obj.indexOf
			this.sprites[index] = this.sprites[this.sprites.length-1];
			this.sprites[index].indexOf = index;
			this.sprites.pop();

			obj.indexOf = -1;
		}
	}
}