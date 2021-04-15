import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Attack extends EnemyState {

    //enemy type
    skeleton: boolean;
    goblin: boolean;

    startTime: number;
    attackDuration: number;

    onEnter() {
        this.skeleton = this.parent.skeleton;
        this.goblin = this.parent.goblin;
        this.startTime = Date.now();
        this.attackDuration = 1000;
        console.log("ATTACK");
    }

    onExit() {
        console.log("ATTACK DONE");
        return{};
    }

    update(deltaT: number) {
        super.update(deltaT);

        if(Date.now() - this.startTime > this.attackDuration) {
            this.finished('chase');
        }

        (<AnimatedSprite>this.owner).animation.playIfNotAlready("ATTACK")

    }

    handleInput(event: GameEvent) {

    }
}