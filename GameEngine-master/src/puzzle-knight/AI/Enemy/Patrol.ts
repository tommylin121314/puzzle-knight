import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Patrol extends EnemyState {

    //position upon entering Patrol state
    startPosition: Vec2;

    //how far the enemy can wander from originalPosition
    patrolRadius: number = 50;

    //Direction of movement
    moveDir: Vec2;

    //Timer for each movement
    startTime: number;
    moveDuration: number = 3000;
    moveCount: number = 1;
    blockMidPos: Vec2;

    onEnter() {
        this.moveDir = new Vec2(0, 0);
        this.startTime = Date.now();
        this.startPosition = this.parent.originalPos;
        (<AnimatedSprite>this.owner).animation.play("IDLE");
        let xFromOrigin = (Math.random() * (2 * this.patrolRadius)) - this.patrolRadius;
        let yFromOrigin = (Math.random() * (2 * this.patrolRadius)) - this.patrolRadius;
        let newDestination = new Vec2(this.startPosition.x + xFromOrigin, this.startPosition.y + yFromOrigin);
        this.moveDir = new Vec2(newDestination.x - this.owner.position.x, newDestination.y - this.owner.position.y);
    }

    onExit(): Record<string, any> {
        this.moveDir = Vec2.ZERO;
        (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }

    update(deltaT: number): void {
        super.update(deltaT);

        //time intervals
        if(((Date.now() - this.startTime) / this.moveCount) > this.moveDuration) {

            //random chance of going idle
            let rand = Math.random() * 100;
            if(rand < 10) {
                this.finished('idle');
            }

            //generates new direction
            let xFromOrigin = (Math.random() * (2 * this.patrolRadius)) - this.patrolRadius;
            let yFromOrigin = (Math.random() * (2 * this.patrolRadius)) - this.patrolRadius;
            let newDestination = new Vec2(this.startPosition.x + xFromOrigin, this.startPosition.y + yFromOrigin);
            this.moveDir = new Vec2(newDestination.x - this.owner.position.x, newDestination.y - this.owner.position.y);
            this.moveCount++;

        }

        //alert distance
        if(this.owner.position.distanceTo(this.parent.playerPos) < 300 && this.seesPlayer) {
            this.finished("chase");
        }

        //If enemy gets too far from original position, brings enemy back to origin
        if((this.owner.position.distanceTo(this.startPosition) > this.patrolRadius)) {
            this.moveDir = new Vec2(this.startPosition.x - this.owner.position.x, this.startPosition.y - this.owner.position.y);
        }

        /*
        if(!this.moveDir.isZero()) {
            let tilePos = new Vec2(this.owner.position.x + this.moveDir.x * 10, this.owner.position.y + this.moveDir.y * 13);
            let blockVec = this.parent.walls.getColRowAt(tilePos);
            let tile = this.parent.walls.getTileAtRowCol(blockVec);
            if(tile != 0) {
                console.log("HIT WALL");
                this.moveDir = new Vec2(this.startPosition.x - this.owner.position.x, this.startPosition.y - this.owner.position.y);
            }
        }
        */

        /*if(this.moveDir.x != 0) {
            let tilePosX = this.owner.position.x + (this.moveDir.x * 8) + (this.moveDir.x * 3);
            let tilePosY = this.owner.position.y + 16;
            let blockMidPos = new Vec2(tilePosX, tilePosY);
            let blockVec = this.parent.walls.getColRowAt(blockMidPos);
            let tileMid = this.parent.walls.getTileAtRowCol(blockVec);
            if(tileMid != 0) {
                this.moveDir.x = 0;
            }
        }
        if(this.moveDir.y != 0) {
            let tilePosX = this.owner.position.x;
            let tilePosY;
            if(this.moveDir.y === -1) {
                tilePosY = this.owner.position.y + this.moveDir.y * 5;
            }
            else if(this.moveDir.y === 1) {
                tilePosY = this.owner.position.y + this.moveDir.y * 5 + 16;
            }
            this.blockMidPos = new Vec2(tilePosX, tilePosY);
            //let blockLeftPos = new Vec2(tilePosX - 8, tilePosY);
            //let blockRightPos = new Vec2(tilePosX + 8, tilePosY);
            let blockVec = this.parent.walls.getColRowAt(this.blockMidPos);
            //let blockLeftVec = this.parent.walls.getColRowAt(blockLeftPos);
            //let blockRightVec = this.parent.walls.getColRowAt(blockRightPos);
            let tile = this.parent.walls.getTileAtRowCol(blockVec);
            console.log("TILE: " + tile);
            //let tileL = this.parent.walls.getTileAtRowCol(blockLeftVec);
            //let tileR = this.parent.walls.getTileAtRowCol(blockRightVec);
            if((tile != 0 )) {
                this.moveDir.y = 0;
            }
        }*/

        //moves the enemy
        this.owner.move(this.moveDir.normalized().scaled(this.parent.speed * deltaT));

        //Plays correct animation based on movement
        if(!this.moveDir.isZero()) {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("WALK");
        }
        else {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE");
        }
    }

    handleInput(event: GameEvent) {

    }

}