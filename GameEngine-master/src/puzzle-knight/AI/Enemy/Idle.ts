import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Idle extends EnemyState {

    //Current time upon entering state
    startTime: number;

    //duration of idle state before going into patrol state
    idleDuration: number;

    onEnter() {
        this.startTime = Date.now();
        this.idleDuration = 3000;
        (<AnimatedSprite>this.owner).animation.play("IDLE");
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }

    update(deltaT: number): void {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE");
        super.update(deltaT);
        if(Date.now() - this.startTime >= this.idleDuration) {
            this.finished('patrol');
        }

        if(this.owner.position.distanceTo(this.parent.playerPos) < 300) {
            this.finished("chase");
        }
    }

    handleInput(event: GameEvent) {

    }

}