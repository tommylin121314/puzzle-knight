import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerState from "./PlayerState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
export default class Player_Hurt extends PlayerState {

    onEnter() {
        this.parent.invincible = true;
        (<AnimatedSprite>this.owner).animation.play("HURT");
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
    }

    onExit() {
        this.parent.invincible = false;
        return {};
    }

    update(deltaT: number) {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("HURT");
        if(!(<AnimatedSprite>this.owner).animation.isPlaying("HURT")) {
            this.finished("idle");
        }
    }
}