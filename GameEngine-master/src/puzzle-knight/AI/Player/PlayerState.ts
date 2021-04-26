import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "./PlayerController"
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";

export default abstract class PlayerState extends State {

    owner: GameNode;
    parent: PlayerController;
    collisionShape: AABB;

    onIce: boolean;


    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;

        this.onIce = false;
        this.collisionShape = (<AABB>this.owner.collisionShape).clone();
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
            if(Input.isMouseJustPressed()) {
                this.finished("attack");
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

    }

    checkOnIce(): boolean {
        let tilePos = this.parent.ground.getColRowAt(this.owner.position.clone().add(new Vec2(0, 16)));
        let tile = this.parent.ground.getTileAtRowCol(tilePos);
        if(tile === 17) {
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