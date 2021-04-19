import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyState from "./EnemyState";

export default class Death extends EnemyState {

    deathStart: number;

    onEnter() {
        this.deathStart = Date.now();
        (<AnimatedSprite>this.owner).animation.play("DEATH");
    }

    onExit() {
        console.log("enemy destroyed");
        console.log(this.owner);
        this.owner.destroy();
        return {};
    }

    update(deltaT: number) {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("DEATH");
        
        if(Date.now() - this.deathStart > 1500) {
            this.finished('death');
        }
    }
}