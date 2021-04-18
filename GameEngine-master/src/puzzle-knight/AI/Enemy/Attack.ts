import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Attack extends EnemyState {

    //enemy type
    skeleton: boolean;
    goblin: boolean;

    skeletonDamage: number;
    goblinDamage: number;

    startTime: number;
    windUpDuration: number;
    attacked: boolean;

    bow: AnimatedSprite;
    arrow: Sprite;

    hitbox: AABB;

    playerDir: Vec2;

    onEnter() {
        //determines type of enemy
        this.skeleton = this.parent.skeleton;
        this.goblin = this.parent.goblin;

        //times the attack
        this.startTime = Date.now();

        //if skeleton, sets up bow and arrow
        if(this.skeleton) {
            this.skeletonDamage = 20;
            this.windUpDuration = 1250;

            //gets bow and arrow from EnemyController
            this.bow = this.parent.bow;
            this.arrow = this.parent.arrow;

            //puts bow on the attack layer
            this.bow.setLayer(this.parent.attackLayer);

            //sets up the bow position and rotation
            this.bow.position.set(this.owner.position.x, this.owner.position.y);
            this.playerDir = this.bow.position.dirTo(this.parent.playerPos);
            this.bow.rotation = Vec2.LEFT.angleToCCW(this.playerDir);
            this.bow.position.add(new Vec2(this.playerDir.x * 5, this.playerDir.y * 5));

            this.bow.animation.play("SHOOT");

            this.bow.visible = true;
        }

        if(this.goblin) {
            this.attacked = false;
            this.goblinDamage = 25;
            this.windUpDuration = 350;
            this.playerDir = this.owner.position.dirTo(this.parent.playerPos);
            let hitboxCenter = new Vec2(this.owner.position.x + this.playerDir.x * 5, this.owner.position.y + this.playerDir.y * 5);
            this.hitbox = new AABB(hitboxCenter, new Vec2(10, 10));
            (<AnimatedSprite>this.owner).animation.play("ATTACK");
        }
    }

    onExit() {

        //if enemy was a skeleton, will fire an event that spawns and arrow with the given properties
        if(this.parent.skeleton) {
            this.bow.visible = false;
            this.emitter.fireEvent("SKELETON_ATTACK", {
                direction: this.playerDir,
                firePos: this.bow.position.clone(),
                speed: 120,
                damage: this.skeletonDamage,
                playerPos: this.parent.playerPos
            });
        }

        return{};
    }

    update(deltaT: number) {
        super.update(deltaT);

        if(this.parent.skeleton) {

            //skeleton aims for a bit before firing
            if(Date.now() - this.startTime < this.windUpDuration) {
                this.playerDir = this.bow.position.dirTo(this.parent.playerPos);
                this.bow.rotation = Vec2.LEFT.angleToCCW(this.playerDir);
                this.bow.position.set(this.owner.position.x + (this.playerDir.x * 5), this.owner.position.y + (this.playerDir.y * 5));
            }

            //Flips sprite based on where it's aiming
            if(this.playerDir.x > 0){
                (<AnimatedSprite>this.owner).invertX = true;
            }
            else if(this.playerDir.x < 0){
                (<AnimatedSprite>this.owner).invertX = false;
            }

            //plays shooting animation
            if(this.bow.animation.isPlaying("SHOOT")) {
                (<AnimatedSprite>this.owner).animation.playIfNotAlready("ATTACK");
            }
            //once shooting is done, resume chasing
            else {
                this.finished("chase");
            }
        }

        if(this.parent.goblin) {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("ATTACK");

            //times the trigger check with the down swing of the goblin's axe
            //if player is hit, an event is fired
            if(Date.now() - this.startTime > this.windUpDuration && (<AnimatedSprite>this.owner).animation.isPlaying("ATTACK") && !this.attacked) {
                if(this.hitbox.overlaps(new AABB(this.parent.playerPos, new Vec2(5, 5)))){
                    this.emitter.fireEvent("GOBLIN_HIT_PLAYER", {
                        damage: this.goblinDamage
                    });
                    this.attacked = true;
                }
            }

            //after a certain amount of time after attacking, goblin will resume chasing
            if(Date.now() - this.startTime > 2000) {
                this.finished("chase");
            }

        }

    }

    handleInput(event: GameEvent) {

    }
}