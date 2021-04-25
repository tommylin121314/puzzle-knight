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

        /*
        if(moveDir.x != 0) {
            let tilePosX = this.owner.position.x + (moveDir.x * 8) + (moveDir.x * 3);
            let tilePosY = this.owner.position.y + 16;
            let blockMidPos = new Vec2(tilePosX, tilePosY);
            let blockVec = this.parent.walls.getColRowAt(blockMidPos);
            let tileMid = this.parent.walls.getTileAtRowCol(blockVec);
            if(tileMid != 0) {
                moveDir.x = 0;
                console.log("STUCK X");
            }
        }
        if(moveDir.y != 0) {
            let tilePosX = this.owner.position.x;
            let tilePosY;
            console.log(moveDir.toString());
            if(moveDir.y === -1) {
                tilePosY = this.owner.position.y + moveDir.y * 5;
            }
            else if(moveDir.y === 1) {
                tilePosY = this.owner.position.y + moveDir.y * 5 + 16;
            }
            let blockMidPos = new Vec2(tilePosX, tilePosY);
            let blockLeftPos = new Vec2(tilePosX - 8, tilePosY);
            let blockRightPos = new Vec2(tilePosX + 8, tilePosY);
            let blockVec = this.parent.walls.getColRowAt(blockMidPos);
            let blockLeftVec = this.parent.walls.getColRowAt(blockLeftPos);
            let blockRightVec = this.parent.walls.getColRowAt(blockRightPos);
            let tile = this.parent.walls.getTileAtRowCol(blockVec);
            let tileL = this.parent.walls.getTileAtRowCol(blockLeftVec);
            let tileR = this.parent.walls.getTileAtRowCol(blockRightVec);
            if((tile != 0 || tileL != 0 || tileR != 0)) {
                moveDir.y = 0;
                console.log("STUCK Y");
            }
        }*/


        this.owner.move(moveDir.normalized().scale(this.parent.speed * deltaT));
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("WALK");

    }

    handleInput(event: GameEvent) {

    }

}