import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerState from "./PlayerState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
export default class Player_Death extends PlayerState {

    deathTimer: number;

    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("DEATH");
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
        this.deathTimer = Date.now();
    }

    onExit() {
        this.owner.removePhysics();
        this.owner.setAIActive(false, {});
        (<AnimatedSprite>this.owner).visible = false;
        this.owner.isCollidable = false;
        return {};
    }

    update(deltaT: number) {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("DEATH");
        if(!(<AnimatedSprite>this.owner).animation.isPlaying("DEATH")) {
            this.finished("idle");
        }
    }
}