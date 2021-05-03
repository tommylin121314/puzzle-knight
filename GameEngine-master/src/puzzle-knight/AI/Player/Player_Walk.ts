import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "./PlayerController";
import PlayerState from "./PlayerState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class Walk extends PlayerState {

    feetPos: Vec2;
    onEnter() {
        this.feetPos = new Vec2(this.owner.position.x, this.owner.position.y + 13);
        (<AnimatedSprite>this.owner).animation.play("WALK");
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "walk", loop: false, holdReference: false});
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

        if(this.parent.scene.mapType === 'ice' && this.onIce) {
            if(dir.x === 1) {
                this.parent.slideDir = new Vec2(1, 0);
                this.finished("slide");
            }
            else if(dir.x === -1) {
                this.parent.slideDir = new Vec2(-1, 0);
                this.finished("slide");
            }
            else if(dir.y === 1) {
                this.parent.slideDir = new Vec2(0, 1);
                this.finished("slide");
            }
            else if(dir.y === -1) {
                this.parent.slideDir = new Vec2(0, -1);
                this.finished("slide");
            }
        }

        this.owner.move(dir.normalized().clone().scale(this.parent.speed * deltaT));
    }
}