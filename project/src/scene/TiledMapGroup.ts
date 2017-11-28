module fly {
	export class TiledMapGroup {
		group:TiledMapObject[] = []
		isArray:boolean = false
		num:number = 1

		public constructor() {
		}

		public push(obj:TiledMapObject)
		{
			this.group.push(obj)
		}
	}
}