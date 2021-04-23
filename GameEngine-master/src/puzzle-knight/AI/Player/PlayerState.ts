import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "./PlayerController"
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";

export default abstract class PlayerState extends State {

    owner: GameNode;
    parent: PlayerController;


    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;
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