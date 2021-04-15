import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Chase extends EnemyState {

    skeletonRange: number;
    goblinRange: number;

    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("WALK");
        this.skeletonRange = 150;
        this.goblinRange = 20;
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }

    update(deltaT: number): void {
        super.update(deltaT);

        let currPos = this.owner.position;
        let playerPos = this.parent.playerPos;
        let moveDir = new Vec2(playerPos.x - currPos.x, playerPos.y - currPos.y);

        if(currPos.distanceTo(playerPos) < this.skeletonRange) {
            console.log("SKELETON RANGE");
        }
        if(!(currPos.distanceTo(playerPos) < this.goblinRange)) {
            this.owner.move(moveDir.normalized().scale(this.parent.speed * deltaT));
        }


        (<AnimatedSprite>this.owner).animation.play("WALK");

    }

    handleInput(event: GameEvent) {

    }

}