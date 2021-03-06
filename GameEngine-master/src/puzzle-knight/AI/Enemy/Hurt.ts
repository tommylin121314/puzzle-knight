import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyState from "./EnemyState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class Hurt extends EnemyState {

    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("HURT");
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});

    }

    onExit() {
        return {};
    }

    update(deltaT: number) {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("HURT");
        if(!(<AnimatedSprite>this.owner).animation.isPlaying("HURT")) {
            if(this.parent.health <= 0) {
                this.finished("death");
            }
            else
                this.finished("chase");
        }
    }
}