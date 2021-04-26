import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerState from "./PlayerState";

export default class Player_Slide extends PlayerState {

    originalOffset: Vec2;
    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("IDLE");
        (<AnimatedSprite>this.owner).animation.stop();

        //this.originalOffset = this.owner.colliderOffset.clone();
        this.owner.collisionShape.halfSize.add(new Vec2(Math.abs(this.parent.slideDir.x), Math.abs(this.parent.slideDir.y)).scale(4));
        this.parent.static = true;

    }

    onExit() {
        /*this.owner.collisionShape = this.collisionShape;
        this.owner.collisionShape.center = this.owner.position;
        this.owner.colliderOffset = new Vec2(0, 12);*/
        this.owner.collisionShape.halfSize.sub(new Vec2(Math.abs(this.parent.slideDir.x), Math.abs(this.parent.slideDir.y)).scale(4));
        this.parent.static = false;
        return {};
    }

    update(deltaT: number) {
        let checkWallPos = this.owner.collisionShape.clone().center;
        let tilePos = this.parent.walls.getColRowAt(checkWallPos);
        let tile = this.parent.walls.getTileAtRowCol(tilePos);
        if(tile > 0) {
            this.finished("idle");
        }

        if(this.owner.collidedWithTilemap || !this.onIce) {
            this.finished("idle");
        }

        super.update(deltaT);
        if(!this.owner.collidedWithTilemap)
            this.owner.move(this.parent.slideDir.clone().scale(this.parent.speed * 1.3 * deltaT));

    }

}