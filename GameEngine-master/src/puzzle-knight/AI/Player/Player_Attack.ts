import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerState from "./PlayerState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class Player_Attack extends PlayerState {

    loadingStartTime: number;
    attackSpeed: number;
    shotFired: boolean;
    audioTracker = 0;

    onEnter() {
        (<AnimatedSprite>this.owner).animation.play("RANGED_ATTACK");
        this.loadingStartTime = Date.now();
        this.attackSpeed = this.parent.attackSpeed;
        this.shotFired = false;
    }

    onExit() {
        this.audioTracker = 0;
        return {};
    }

    update(deltaT: number) {

        //Inverts player based on direction of attack
        if(Input.getGlobalMousePosition().x > this.owner.position.x) {
            (<AnimatedSprite>this.owner).invertX = false;
        }
        else {
            (<AnimatedSprite>this.owner).invertX = true;
        }

        //Attack
        if (this.parent.usingBow){

            (<AnimatedSprite>this.owner).animation.playIfNotAlready("RANGED_ATTACK");

            if(Date.now() - this.loadingStartTime >= this.attackSpeed && !this.shotFired) {
                let dir = this.owner.position.dirTo(Input.getGlobalMousePosition());
                this.emitter.fireEvent("PLAYER_RANGED_ATTACK", {
                    direction: dir,
                    firePos: this.owner.position.clone(),
                    speed: 300
                });
                
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bow", loop: false, holdReference: false});

                this.shotFired = true;
            }

            if(this.shotFired) {
                this.finished("idle");
            }

        }
        else{
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("MELEE_ATTACK");
            if (this.audioTracker == 0){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "melee", loop: false, holdReference: false});
                this.audioTracker = 1;
            }
            let dir = this.owner.position.dirTo(Input.getGlobalMousePosition());

            let hitboxPox = new Vec2(this.owner.position.x + dir.x*15, this.owner.position.y + dir.y*15);
            
            
            this.emitter.fireEvent("PLAYER_MELEE_ATTACK", {
                pos: hitboxPox.clone(),
                damage: this.parent.meleeDamage
                
            });
            
            
            if(!(<AnimatedSprite>this.owner).animation.isPlaying("MELEE_ATTACK")) {
                this.finished("idle");
            }
        }

        let dir = this.getInputDirection();
        this.owner.move(dir.normalized().scale(this.parent.speed * deltaT));


    }
}