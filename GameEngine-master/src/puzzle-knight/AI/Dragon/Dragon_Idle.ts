import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import DragonState from "./DragonState";

export default class Dragon_Idle extends DragonState {

    startTime: number;
    idleDuration: number;

    onEnter() {
        console.log("ENTER: IDLE");
        (<AnimatedSprite>this.owner).animation.play("IDLE");
        this.startTime = Date.now();
        this.idleDuration = Math.random() * 2000 + 2000;
    }

    onExit() {
        console.log("EXIT: IDLE");
        return {};
    }

    update(deltaT: number) {
        super.update(deltaT);
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE");

        if(Date.now() - this.startTime > this.idleDuration) {
            let atkNum = Math.random();

            if(atkNum < 0.3) {
                this.finished("rightAttack");
            }
            else if(atkNum < 0.6) {
                this.finished("leftAttack");
            }
            else {
                this.finished("roarAttack");
            }
        }
    }

}