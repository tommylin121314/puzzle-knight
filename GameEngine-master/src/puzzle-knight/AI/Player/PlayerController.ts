import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import BattlerAI from "../BattlerAI";

export default class PlayerController implements BattlerAI{
    health: number
    owner: AnimatedSprite

    //movement
    private direction: Vec2
    private speed: number
    private lookDir: Vec2
    private lastLookedRight: boolean

    initializeAI(owner: AnimatedSprite, options: Record<string, any>) {
        this.owner = owner;
        this.direction = new Vec2(0, 0);
        this.lookDir = new Vec2(0, 0);
        this.speed = options.speed;
    }

    activate(options: Record<string, any>) {    }

    handleEvent(event: GameEvent) {    }

    update(deltaT: number): void {

        console.log(this.speed);
        //Updates direction of movement
        let xInput, yInput;
        if(Input.isKeyPressed("a") && !Input.isKeyPressed("d")) {
            xInput = -1;
            this.lastLookedRight = false;
        }
        else if(Input.isKeyPressed("d") && !Input.isKeyPressed("a")) {
            xInput = 1;
            this.lastLookedRight = true;
        }
        else {
            xInput = 0;
        }
        if(Input.isKeyPressed("w") && !Input.isKeyPressed("s")) {
            yInput = -1;
        }
        else if(Input.isKeyPressed("s") && !Input.isKeyPressed("w")) {
            yInput = 1;
        }
        else {
            yInput = 0;
        }
        this.direction = new Vec2(xInput, yInput);

        if(this.lastLookedRight) {
            console.log("flip");
            this.owner.invertX = false;
        }
        else {
            this.owner.invertX = true;
        }

        //Moves player
        if(!this.direction.isZero()) {
            console.log("MOVING");
            this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
            this.owner.animation.playIfNotAlready("WALK");
        }
        else {
            this.owner.animation.playIfNotAlready("IDLE");
        }
    }

    damage(damage: number): void {
        this.health -= damage;
        if(this.health <= 0) {
            console.log("PLAYER KILLED");
        }
    }

    destroy() {    }
}