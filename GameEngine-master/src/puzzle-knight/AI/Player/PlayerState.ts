import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "./PlayerController"
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Timer from "../../../Wolfie2D/Timing/Timer";

export default abstract class PlayerState extends State {

    owner: GameNode;
    parent: PlayerController;
    collisionShape: AABB;
    attackedTime: number;
    bowReloadTime: number = 600;
    meleeReloadTime: number = 250;

    onIce: boolean;
    prevTilePos: Vec2;


    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;

        this.onIce = false;
        this.collisionShape = (<AABB>this.owner.collisionShape).clone();
        this.attackedTime = Date.now();
        this.prevTilePos = this.parent.ground.getColRowAt(this.owner.position.clone().add(new Vec2(0, 16)));
    }

    handleInput(event: GameEvent) {

    }

    update(deltaT: number): void {
        if(this.owner._velocity.x < 0){
            (<AnimatedSprite>this.owner).invertX = true;
        }
        else if(this.owner._velocity.x > 0){
            (<AnimatedSprite>this.owner).invertX = false;
        }

        if(!this.parent.static) {
            if(this.parent.usingBow) {
                if(Date.now() - this.attackedTime > this.bowReloadTime) {
                    if(Input.isMouseJustPressed()) {
                        this.finished("attack");
                        this.attackedTime = Date.now();
                    }
                }
            }
            else {
                if(Input.isMouseJustPressed()) {
                    this.finished("attack");
                }
            }
            if(Input.isKeyJustPressed("q")) {
                this.parent.usingBow = !this.parent.usingBow;
            }

            if(Input.isKeyJustPressed("e")) {
                this.searchForPots();
            }
        }

        //SLIDING HANDLING
        if(this.parent.scene.mapType === 'ice') {
            this.onIce = this.checkOnIce();
        }

        if(this.parent.scene.mapType === 'ice2') {
            if (this.checkIfInVoid()) {
                (<PlayerController>this.owner.ai).changeState("death");
            }
            this.breakIce();
            this.setPrevTile();
        }

    }

    checkOnIce(): boolean {
        let tilePos = this.parent.ground.getColRowAt(this.owner.position.clone().add(new Vec2(0, 16)));
        let tile = this.parent.ground.getTileAtRowCol(tilePos);
        if(tile === 17) {
            return true;
        }
        return false;
    }

    setPrevTile() {
        this.prevTilePos = this.parent.ground.getColRowAt(this.owner.position.clone().add(new Vec2(0, 16)));
    }

    breakIce(): void {
        let prevTile = null;
        let tilePos = this.parent.ground.getColRowAt(this.owner.position.clone().add(new Vec2(0, 16)));
        // check if player moved from breaking ice tile
        // console.log(!(this.prevTilePos.x/32 == tilePos.x/32 && this.prevTilePos.y/32 == tilePos.y/32));
        if (!(this.prevTilePos.x/32 == tilePos.x/32 && this.prevTilePos.y/32 == tilePos.y/32)) {
            prevTile = this.parent.ground.getTileAtRowCol(this.prevTilePos);
            // console.log(prevTile);

            if (prevTile === 19) {
                this.parent.ground.setTileAtRowCol(this.prevTilePos, 20);
                let prevTilePosCopy = this.prevTilePos
                let iceTimer = new Timer(100, () => {
                    // console.log("timer running");
                    this.parent.ground.setTileAtRowCol(prevTilePosCopy, 14);
                })
                iceTimer.start();
                // console.log("moved from ice tile");
            }
        }
        return;
    }

    checkIfInVoid(): boolean {
        let tilePos = this.parent.ground.getColRowAt(this.owner.position.clone().add(new Vec2(0, 16)));
        let tile = this.parent.ground.getTileAtRowCol(tilePos);
        if(tile === 14) {
            // console.log("in the void rip");
            return true;
        }
        return false;
    }

    getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isKeyPressed("a") ? -1 : 0) + (Input.isKeyPressed("d") ? 1 : 0);
		direction.y = (Input.isKeyPressed("w") ? -1 : 0) + (Input.isKeyPressed("s") ? 1 : 0);
		return direction;
	}

    searchForPots() {
        this.parent.pots.forEach(pot => {
            if(pot.position.clone().distanceTo(this.owner.position) < 20) {
                this.emitter.fireEvent("HEALTH_POT", {
                    pot: pot
                })
            }
        });
    }

}