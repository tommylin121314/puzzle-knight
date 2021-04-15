import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import EnemyState from "./EnemyState";

export default class Attack extends EnemyState {

    //enemy type
    skeleton: boolean;
    goblin: boolean;

    startTime: number;
    attackDuration: number;

    bow: AnimatedSprite;

    onEnter() {
        //determines type of enemy
        this.skeleton = this.parent.skeleton;
        this.goblin = this.parent.goblin;

        //times the attack
        this.startTime = Date.now();
        this.attackDuration = 1000;

        //if skeleton, sets up bow and arrow
        if(this.skeleton) {

            //gets bow from EnemyController
            this.bow = this.parent.bow;

            //puts bow on the attack layer
            this.bow.setLayer(this.parent.attackLayer);

            //sets up the bow position and rotation
            this.bow.position.set(this.owner.position.x, this.owner.position.y);
            let playerDir = this.bow.position.dirTo(this.parent.playerPos);
            this.bow.rotation = Vec2.LEFT.angleToCCW(playerDir);
            this.bow.position.add(new Vec2(playerDir.x * 5, playerDir.y * 5));

            this.bow.animation.play("SHOOT");

            this.bow.visible = true;
        }
    }

    onExit() {
        console.log("ATTACK DONE");
        this.bow.visible = false;
        return{};
    }

    update(deltaT: number) {
        super.update(deltaT);

        if(Date.now() - this.startTime > this.attackDuration) {
            this.finished('chase');
        }

        if(this.bow.animation.isPlaying("SHOOT")) {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("ATTACK");
        }
        else {
            (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE");
            this.bow.visible = false;
        }

    }

    handleInput(event: GameEvent) {

    }
}