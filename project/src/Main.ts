class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }


    private onAddToStage(event: egret.Event) {
        egret.lifecycle.addLifecycleListener((conttext) => {
            conttext.onUpdate = () => {
                console.log('Start Game2!');
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
            console.log('Game2 onPause!');
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
            console.log('Game2 onResume!');
        }

        this.createGameScene();
    }

    private _circle: egret.Shape;
    private createGameScene() {
        console.log("createGameScene width: " + this.stage.stageWidth);
        console.log("createGameScene height: " + this.stage.stageHeight);

        let bg = this.drawRect(0x000000, 0, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.addChild(bg);

        this._circle = this.drawCircle(0xFF0000, 0, 0, 100);
        this.addChild(this._circle);

        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        bg.addEventListener(egret.TouchEvent.TOUCH_END,   this.onTouchEnd,   this);
        bg.addEventListener(egret.TouchEvent.TOUCH_MOVE,  this.onTouchMove,  this);
        bg.addEventListener(egret.TouchEvent.TOUCH_TAP,   this.onTouchTap,   this);
    }

    private onTouchBegin(event: egret.TouchEvent) {
        if (this._circle != null)
        {
            this._circle.x = event.stageX;
            this._circle.y = event.stageY;
        }
    }

    private onTouchEnd(event: egret.TouchEvent) {
        
    }

    private onTouchMove(event: egret.TouchEvent) {
        
    }

    private onTouchTap(event: egret.TouchEvent) {
        
    }

    private drawRect(color: number, x: number, y: number, width: number, height: number): egret.Shape {
        let sprite = new egret.Shape();
        sprite.graphics.beginFill(color, 1);
        sprite.graphics.drawRect(x, y, width, height);
        sprite.graphics.endFill();
        return sprite;
    }

    private drawCircle(color: number, x: number, y: number, radius: number): egret.Shape {
        let sprite = new egret.Shape();
        sprite.graphics.beginFill(color, 1);
        sprite.graphics.drawCircle(x, y, radius);
        sprite.graphics.endFill();
        return sprite;
    }
}