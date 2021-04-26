import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Chase extends EnemyState {

    attackRange: number;
    aggroRange: number;

    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("WALK");
        if(this.parent.skeleton) {
            this.attackRange = 120;
        }
        else if(this.parent.goblin) {
            this.attackRange = 20;
        }
        this.aggroRange = 300;
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }

    update(deltaT: number): void {
        super.update(deltaT);

        let currPos = this.owner.position;
        let playerPos = this.parent.playerPos;
        let moveDir = new Vec2(playerPos.x - currPos.x, playerPos.y - currPos.y).normalized();

        if(currPos.distanceTo(playerPos) < this.attackRange) {
            this.finished('attack');
        }

        if(currPos.distanceTo(playerPos) > this.aggroRange || !this.seesPlayer) {
            this.finished('patrol');
        }

        this.owner.move(moveDir.normalized().scale(this.parent.speed * deltaT));
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("WALK");

    }

    handleInput(event: GameEvent) {

    }

}