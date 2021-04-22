import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerState from "./PlayerState";

export default class Player_Idle extends PlayerState {

    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("IDLE");
    }

    onExit() {
        return {};
    }

    update(deltaT: number) {
        super.update(deltaT);

        (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE");
        
        let dir = this.getInputDirection();
        if(!dir.isZero()) {
            this.finished("walk");
        }
    }
}