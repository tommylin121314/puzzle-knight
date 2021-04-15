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

    startTime: number;
    windUpDuration: number;

    bow: AnimatedSprite;
    arrow: Sprite;

    playerDir: Vec2;

    onEnter() {
        //determines type of enemy
        this.skeleton = this.parent.skeleton;
        this.goblin = this.parent.goblin;

        //times the attack
        this.startTime = Date.now();
        this.windUpDuration = 1250;

        //if skeleton, sets up bow and arrow
        if(this.skeleton) {

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
    }

    onExit() {
        console.log("ATTACK DONE");
        this.bow.visible = false;

        this.emitter.fireEvent("SKELETON_ATTACK", {
            direction: this.playerDir,
            firePos: this.bow.position.clone(),
            speed: 60
        });
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

    }

    handleInput(event: GameEvent) {

    }
}