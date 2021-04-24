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
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameLevel from "../../Scenes/GameLevel";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import Player_Idle from "./Player_Idle";
import Player_Walk from "./Player_Walk";
import Player_Attack from "./Player_Attack";
import Player_Hurt from "./Player_Hurt";
import Player_Death from "./Player_Death";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

export default class PlayerController extends StateMachineAI implements BattlerAI{
    health: number = 5
    owner: AnimatedSprite

    //movement
    direction: Vec2
    speed: number
    lookDir: Vec2
    lastLookedRight: boolean
    arrow: Sprite
    emitter: Emitter
    loadingBow: boolean = false;
    loadingStartTime: number;
    attackSpeed: number = 200;
    usingBow: boolean = true;
    scene: GameLevel;
    receiver: Receiver;
    invincible: boolean;
    walls: OrthogonalTilemap;

    pots: Array<Sprite>;

    meleeDamage: number = 40;
    rangeDamage: number = 20;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>) {
        this.owner = owner;
        this.direction = new Vec2(0, 0);
        this.lookDir = new Vec2(0, 0);
        this.speed = options.speed;

        this.arrow = options.arrow;
        this.arrow.visible = false;
        this.emitter = options.emitter;
        this.scene = options.scene;
        this.receiver = options.receiver;
        this.walls = options.walls;
        this.receiver.subscribe("PLAYER_HIT");
        console.log(this.receiver);

        this.invincible = false;

        this.pots = options.pots;

        let idle = new Player_Idle(this.owner, this);
        this.addState("idle", idle);
        let walk = new Player_Walk(this.owner, this);
        this.addState("walk", walk);
        let attack = new Player_Attack(this.owner, this);
        this.addState("attack", attack);
        let hurt = new Player_Hurt(this.owner, this);
        this.addState("hurt", hurt);
        let death = new Player_Death(this.owner, this);
        this.addState("death", death);

        this.initialize("idle");

    }

    activate(options: Record<string, any>) {    }

    update(deltaT: number): void {
        super.update(deltaT);

        /*
        if(!this.scene.alive){
            return;
        }

        //PLAYER TAKING DAMAGE EVENT HANDLING
        if(this.receiver.hasNextEvent()) {
            console.log("has event");
            let event = this.receiver.getNextEvent();
            if(event.type === "PLAYER_HIT" && !this.invincible) {
                console.log("hello");
            }
        }
/*
        if(!this.owner.animation.isPlaying("HURT"))
            this.invincible = false;

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
                

                
                let hitboxPox = new Vec2(this.owner.position.x + dir.x*15, this.owner.position.y + dir.y*15);
                this.emitter.fireEvent("PLAYER_MELEE_ATTACK", {
                    pos: hitboxPox.clone(),
                    damage: this.meleeDamage
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

            this.usingBow = !this.usingBow;
        }


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

            this.owner.invertX = false;
        }
        else {
            this.owner.invertX = true;
        }

        if(Input.isKeyJustPressed("e")) {
            this.searchForPots();
        }

        //Moves player
        if(!this.direction.isZero()) {

            this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
            if(this.owner.animation.isPlaying("RANGED_ATTACK") || this.owner.animation.isPlaying("MELEE_ATTACK") || 
                this.owner.animation.isPlaying("HURT")){
            }
            else {
                this.owner.animation.playIfNotAlready("WALK");
            }
        }
        else {
            if(this.owner.animation.isPlaying("RANGED_ATTACK") || this.owner.animation.isPlaying("MELEE_ATTACK") || 
            this.owner.animation.isPlaying("HURT")){
            }
            else {
                this.owner.animation.playIfNotAlready("IDLE");
            }
        }
        */

    }

    damage(damage: number): void {
        this.health -= damage;
        if(this.health <= 0) {

            this.owner.animation.playIfNotAlready("DEATH");
        }
    }

    searchForPots() {
        this.pots.forEach(pot => {
            if(pot.position.clone().distanceTo(this.owner.position) < 20) {
                this.emitter.fireEvent("HEALTH_POT", {
                    pot: pot
                })
            }
        });
    }

    getMeleeDmg() { 
        return this.meleeDamage;
    }

    getRangeDmg() {
        return this.rangeDamage;
    }

    changeState(state: string) {
        super.changeState(state);
    }

    destroy() {    }
}