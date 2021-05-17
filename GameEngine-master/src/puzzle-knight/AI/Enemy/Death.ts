import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyState from "./EnemyState";
import PlayerController from "../Player/PlayerController";

export default class Death extends EnemyState {

    deathStart: number;

    onEnter() {
        this.deathStart = Date.now();
        (<AnimatedSprite>this.owner).animation.play("DEATH");
    }

    onExit() {
        this.owner.destroy();
        PlayerController.xp += 1;
        if (PlayerController.xp == PlayerController.level){
            PlayerController.xp = 0;
            PlayerController.level += 1;

        }
        return {};
    }

    update(deltaT: number) {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("DEATH");
        
        if(Date.now() - this.deathStart > 1500) {
            this.finished('death');
        }
    }
}