import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import DragonState from "./DragonState";

export default class Dragon_RoarAttack extends DragonState {

    attackOp: number;
    startTime: number;
    attackTime: number;

    pulseCounter: number;
    fired: boolean;

    onEnter() {
        console.log("ENTER: ROAR");
        (<AnimatedSprite>this.owner).animation.play("ROARATTACK");
        this.attackOp = Math.random() * 10;
        this.startTime = Date.now();
        this.pulseCounter = 1;
        this.fired = false;
    }

    onExit() {
        console.log("EXIT: ROAR");
        return {};
    }

    update(deltaT: number) {
        super.update(deltaT);
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("ROARATTACK");

        if(Date.now() - this.startTime > 1000) {
            if(this.attackOp < 65) {
                let direction = new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1).normalized();
                this.emitter.fireEvent("DRAGONLEFTATTACK", {
                    firePos: this.owner.position.clone().add(new Vec2(0, -25)),
                    damage: 40,
                    direction: direction,
                    speed: Math.random() * 40 + 220,
                    type: 1
                });
            }
            else {
                let mouth = this.owner.position.clone().add(new Vec2(0, -25));
                let direction = this.parent.playerPos.clone().sub(mouth).normalized();
                if((<AnimatedSprite>this.owner).animation.getIndex() === 20 && !this.fired) {
                    this.fired = true;
                    this.emitter.fireEvent("DRAGONLEFTATTACK", {
                        firePos: this.owner.position.clone().add(new Vec2(0, -25)),
                        damage: 60,
                        direction: direction,
                        speed: 300,
                        type: 2
                    });
                }
            }
        }

        if(!(<AnimatedSprite>this.owner).animation.isPlaying("ROARATTACK")) {
            let rand = Math.random()
            if(rand < 0.15)
                this.finished("leftAttack");
            else if(rand < 0.3)
                this.finished("rightAttack");
            else if(rand < 0.6)
                this.finished("roarAttack");
            else
                this.finished("idle");
        }
    }

}