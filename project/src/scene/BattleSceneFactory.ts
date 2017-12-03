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
					scene.player = player
					player.beginListener()
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
			else if (obj.type == "plane")
			{
				let plane = new Plane(obj.x, obj.y, obj.width/2, 
				{
					path:obj.params["path"]
					, rotation:Number(obj.params["rotation"])
				})
				scene.addToWorld(plane)
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
			else if (obj.type == "windtraps")
			{
				let traps = new WindTraps(obj.x, obj.y, obj.width/2, 
				{
					type:Number(obj.params["type"])
					, min:Number(obj.params["min"])
					, max:Number(obj.params["max"])
					, sound:Number(obj.params["sound"])
				})
				scene.addToWorld(traps)
			}
			else if (obj.type == "aitraps")
			{
				let traps = new AiTraps(obj.x, obj.y, obj.width/2, 
				{
					path:obj.params["path"]
					, damping:Number(obj.params["damping"])
					, rotation:Number(obj.params["rotation"])
					, pRadius:Number(obj.params["radius"])
					, pVelocity:Number(obj.params["velocity"])
					, sound:Number(obj.params["sound"])
				})
				scene.addToWorld(traps)
			}
			else if (obj.type == "weightblock")
			{
				let block = new WeightBlock(obj.x, obj.y, obj.width, obj.height, 
				{
					path:obj.params["path"]
					, rotation:Number(obj.params["rotation"])
					, min:Number(obj.params["min"])
					, max:Number(obj.params["max"])
				})
				scene.addToWorld(block)
			}
			else if (obj.type == "weightmonster")
			{
				let block = new WeightMonster(obj.x, obj.y, obj.width, obj.height, 
				{
					path:obj.params["path"]
					, rotation:Number(obj.params["rotation"])
					, min:Number(obj.params["min"])
					, max:Number(obj.params["max"])
					, sound:Number(obj.params["sound"])
				})
				scene.addToWorld(block)
			}
			else if (obj.type == "movetraps")
			{
				let traps = new MoveTraps(obj.x, obj.y, obj.width, obj.height, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, rotation:Number(obj.params["rotation"])
					, tx:Number(obj.params["tx"])
					, ty:Number(obj.params["ty"])
					, pVelocity:Number(obj.params["velocity"])
				})
				scene.addToWorld(traps)
			}
			else if (obj.type == "image")
			{
				let png = FlyTools.createBitmapByName(obj.params["path"])
				png.x = obj.x + png.width/2
				png.y = obj.y + png.height/2
				png.anchorOffsetX = png.width/2
				png.anchorOffsetY = png.height/2
				png.scaleX = Number(obj.params["scale"]||1)
				png.scaleY = Number(obj.params["scale"]||1)
				scene.addImage(png)
			}	
		}

		static createArray(scene:BattleScene, group:TiledMapGroup)
		{
			let array = new CandyArray()
			array.num = group.num

			group.group.forEach(obj => {
				let candy = new Candy(obj.x, obj.y, obj.width/2, 
				{
					path:obj.params["path"]
					, type:Number(obj.params["type"])
					, rotation:Number(obj.params["rotation"])
					, delta:Number(obj.params["delta"])
					, power:Number(obj.params["power"])
				})
				scene.addToWorld(candy)
				array.add(candy)
			})
		}
	}
}