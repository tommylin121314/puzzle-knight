import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Idle extends EnemyState {

    onEnter() {
        console.log("STARTING IDLE STATE");
        console.log("SPEED: " + this.parent.speed);
        (<AnimatedSprite>this.owner).animation.play("IDLE");
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }

    update(deltaT: number) {

    }

    handleInput(event: GameEvent) {

    }

}