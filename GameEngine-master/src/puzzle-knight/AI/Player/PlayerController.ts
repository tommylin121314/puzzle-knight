import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import BattlerAI from "../BattlerAI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import TestDungeon from "../../Scenes/TestDungeon";
import Scene from "../../../Wolfie2D/Scene/Scene";

export default class PlayerController implements BattlerAI{
    health: number = 5
    owner: AnimatedSprite

    //movement
    private direction: Vec2
    private speed: number
    private lookDir: Vec2
    private lastLookedRight: boolean
    private arrow: Sprite
    private emitter: Emitter
    private loadingBow: boolean = false;
    private loadingStartTime: number;
    private attackSpeed: number = 200;
    private usingBow: boolean = true;
    private scene: Scene;
    initializeAI(owner: AnimatedSprite, options: Record<string, any>) {
        this.owner = owner;
        this.direction = new Vec2(0, 0);
        this.lookDir = new Vec2(0, 0);
        this.speed = options.speed;

        this.arrow = options.arrow;
        this.arrow.visible = false;
        this.emitter = options.emitter;
        this.scene = options.scene;
    }

    activate(options: Record<string, any>) {    }

    handleEvent(event: GameEvent) {    }

    update(deltaT: number): void {
        
        if(Input.isMouseJustPressed()){
            if (this.usingBow){
                if(this.loadingBow){
                    return;
                }
                
                this.owner.animation.playIfNotAlready("RANGED_ATTACK");
                
                this.loadingBow = true;
                this.loadingStartTime = Date.now();
            
            }
            else{
                this.owner.animation.playIfNotAlready("MELEE_ATTACK");

                let dir = this.owner.position.dirTo(Input.getGlobalMousePosition());
                
                console.log(dir);
                
                let hitboxPox = new Vec2(this.owner.position.x + dir.x*15, this.owner.position.y + dir.y*15);
                this.emitter.fireEvent("PLAYER_MELEE_ATTACK", {
                    pos: hitboxPox.clone()
                });
            }


        }
        if (this.loadingBow){
            if(Date.now() - this.loadingStartTime >= this.attackSpeed) {
                let dir = this.owner.position.dirTo(Input.getGlobalMousePosition());
                this.emitter.fireEvent("PLAYER_RANGED_ATTACK", {
                    direction: dir,
                    firePos: this.owner.position.clone(),
                    speed: 420
                });
                this.loadingBow = false;
            }

        }
        if (Input.isKeyJustPressed("q")){
            console.log("SWAPPING WEAPONS");
            this.usingBow = !this.usingBow;
        }

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
            if(this.owner.animation.isPlaying("RANGED_ATTACK") || this.owner.animation.isPlaying("MELEE_ATTACK")){
            }
            else {
                this.owner.animation.playIfNotAlready("WALK");
            }
        }
        else {
            if(this.owner.animation.isPlaying("RANGED_ATTACK") || this.owner.animation.isPlaying("MELEE_ATTACK")){
            }
            else {
                this.owner.animation.playIfNotAlready("IDLE");
            }
        }
    }

    damage(damage: number): void {
        this.health -= damage;
        if(this.health <= 0) {
            console.log("PLAYER KILLED");
            this.owner.animation.playIfNotAlready("DEATH");
        }
    }

    destroy() {    }
}