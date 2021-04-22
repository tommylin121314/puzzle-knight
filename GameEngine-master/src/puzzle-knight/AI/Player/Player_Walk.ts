import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerState from "./PlayerState";

export default class Walk extends PlayerState {

    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("WALK");
    }

    onExit() {
        return {};
    }

    update(deltaT: number) {
        super.update(deltaT);

        (<AnimatedSprite>this.owner).animation.playIfNotAlready("WALK");
        let dir = this.getInputDirection();
        if(dir.isZero()) {
            this.finished("idle");
        }
        this.owner.move(dir.normalized().scale(this.parent.speed * deltaT));
    }
}