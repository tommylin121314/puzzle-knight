import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import DragonState from "./DragonState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class Dragon_RightAttack extends DragonState {

    attackDuration: number;
    startTime: number;
    attackDirections: Array<Vec2>;

    onEnter() {
        console.log("ENTER: RIGHT");
        (<AnimatedSprite>this.owner).animation.play("RIGHTATTACK", true);
        this.attackDuration = 1000;
        this.startTime = Date.now();
        this.attackDirections =
        [
            Vec2.LEFT, Vec2.RIGHT, Vec2.UP, Vec2.DOWN,
            new Vec2(-1, 1), new Vec2(1, 1), new Vec2(1, -1), new Vec2(-1, -1)
        ];
    }

    onExit() {
        console.log("EXIT: RIGHT");
        this.attackDirections.forEach(direction => {
            direction.add(new Vec2(Math.random(), Math.random())).normalize();
            this.emitter.fireEvent("DRAGONLEFTATTACK", {
                firePos: this.owner.position.clone().add(new Vec2(32, 64)),
                damage: 30,
                direction: direction,
                speed: Math.random() * 40 + 170,
                type: 0
            });
        });
        return {};
    }

    update(deltaT: number) {
        super.update(deltaT);
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("RIGHTATTACK");

        if((<AnimatedSprite>this.owner).animation.getIndex() === 4) {
            console.log("RIGHT POUND");
            this.attackDirections.forEach(direction => {
                this.emitter.fireEvent("DRAGONLEFTATTACK", {
                    firePos: this.owner.position.clone().add(new Vec2(32, 64)),
                    damage: 30,
                    direction: direction,
                    speed: Math.random() * 30 + 170,
                    type: 0
                });
            });
        }

        if(Date.now() - this.startTime > this.attackDuration && (<AnimatedSprite>this.owner).animation.getIndex() === 0) {
            let rand = Math.random();
            if(rand < 0.25) {
                this.finished("rightAttack")
            }
            else if(rand < 0.6) {
                this.finished("leftAttack");
            }
            else if(rand < 0.8) {
                this.finished("roarAttack");
            }
            else {
                this.finished("idle");
            }
        }
    }

}