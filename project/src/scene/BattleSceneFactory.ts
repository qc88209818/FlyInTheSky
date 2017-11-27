module fly {
	export class BattleSceneFactory {
		public constructor() {
		}

		static createObject(scene:BattleScene, obj:TiledMapObject)
		{
			if (obj.type == "player")
			{
				let player = new Player(obj.x, obj.y, obj.width/2)
				
				scene.addPlayerToWorld(player)
				if (obj.name == "self")
				{
					player.setVisible(true)
					scene.player = player
				}
			}
			else if (obj.type == "wall")
			{
				let wall = new Wall(obj.x, obj.y, obj.width, obj.height)
				scene.addToWorld(wall)
			}
			else if (obj.type == "blockrect")
			{
				let block = new BlockRect(obj.x, obj.y, obj.width, obj.height, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, mass:Number(obj.params["mass"])
					, damping:Number(obj.params["damping"])
					, rotation:Number(obj.params["rotation"])
				})
				scene.addToWorld(block)
			}
			else if (obj.type == "blockcircle")
			{
				let block = new BlockCircle(obj.x, obj.y, obj.width/2, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, mass:Number(obj.params["mass"])
					, damping:Number(obj.params["damping"])
					, rotation:Number(obj.params["rotation"])
				})
				scene.addToWorld(block)
			}
			else if (obj.type == "candy")
			{
				let candy = new Candy(obj.x, obj.y, obj.width/2, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, rotation:Number(obj.params["rotation"])
					, delta:Number(obj.params["delta"])
					, power:Number(obj.params["power"])
				})
				scene.addToWorld(candy)
			}
			else if (obj.type == "traps")
			{
				let traps = new Traps(obj.x, obj.y, obj.width, obj.height, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, rotation:Number(obj.params["rotation"])
				})
				scene.addToWorld(traps)
			}
			else if (obj.type == "weighttraps")
			{
				let traps = new WeightTraps(obj.x, obj.y, obj.width, obj.height, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, rotation:Number(obj.params["rotation"])
					, min:Number(obj.params["min"])
					, max:Number(obj.params["max"])
				})
				scene.addToWorld(traps)
			}	
			else if (obj.type == "weightblock")
			{
				let block = new WeightBlock(obj.x, obj.y, obj.width, obj.height, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, rotation:Number(obj.params["rotation"])
					, min:Number(obj.params["min"])
					, max:Number(obj.params["max"])
				})
				scene.addToWorld(block)
			}			
		}
	}
}