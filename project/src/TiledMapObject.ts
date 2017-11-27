module fly {
	export class TiledMapObject {
		name:string
		type:string
		x:number
		y:number
		width:number
		height:number
		params:{[key: string]: string;} = {}

		public constructor() {
		}
	}
}