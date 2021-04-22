import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import PlayerController from "../AI/Player/PlayerController";
import EnemyController from "../AI/Enemy/EnemyController";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import ProjectileController from "../AI/Other/ProjectileController";
import Timer from "../../Wolfie2D/Timing/Timer";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Game from "../../Wolfie2D/Loop/Game";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Receiver from "../../Wolfie2D/Events/Receiver";
import MainMenu from "./MainMenu";

export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;
    private deathStart: number;
    private deathAnimationLength: number = 1000;

    // healthbar and exp bar
    protected healthPoints: number = 100;
    protected experiencePoints: number = 0;
    protected hpbar: Sprite;
    protected hpbarBorder: Sprite;
    protected xpbar: Sprite;
    protected xpbarBorder: Sprite;
    public alive: boolean = true;

    
    
    // Stuff to end the level and go to the next level
    /*protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;*/

    //enemies
    private enemies: Array<AnimatedSprite>;

    //health potions
    protected healthpots: Array<Sprite>;

    loadScene() {
        this.load.spritesheet("skeletonArcher", "assets/spritesheets/skeletonArcher.json");
        this.load.spritesheet("goblin", "assets/spritesheets/goblin.json");
        this.load.spritesheet("knight", "assets/spritesheets/knight.json");
        this.load.spritesheet("bow", "assets/spritesheets/skeletonBow.json");
        this.load.image("arrow", "assets/sprites/Arrow.png");
        this.load.image("healthbar", "assets/sprites/HealthBar.png");
        this.load.image("healthbarBorder", "assets/sprites/HealthBarBorder.png");
        this.load.image("xpbar", "assets/sprites/XPBar.png");
        this.load.image("xpbarBorder", "assets/sprites/XPBarBorder.png");
        this.load.image("healthpot", "assets/sprites/healthPot.png");
    }

    startScene(): void {

        this.initLayers();
        this.subscribeToEvents();
        this.addUI();
        this.enemies = [];
        this.healthpots = [];

    }

    initViewport() {
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(2);
    }

    subscribeToEvents() {
        this.receiver.subscribe("ARROW_HIT_PLAYER");
        this.receiver.subscribe("GOBLIN_HIT_PLAYER");
        this.receiver.subscribe("SKELETON_ATTACK");
        this.receiver.subscribe("PLAYER_RANGED_ATTACK");
        this.receiver.subscribe("PLAYER_MELEE_ATTACK");
        this.receiver.subscribe("ENEMY_HIT");
        this.receiver.subscribe("HEALTH_POT");
    }

    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case "SKELETON_ATTACK":
                    {
                        let arrow = this.add.sprite("arrow", "attacks");
                        let speed = event.data.get("speed");
                        let direction = event.data.get("direction");
                        arrow.scale = new Vec2(0.5, 0.5);
                        arrow.position = event.data.get("firePos");
                        arrow.rotation = Vec2.RIGHT.angleToCCW(direction);
                        arrow.addPhysics();
                        arrow.addAI(ProjectileController,
                            {
                                direction: direction,
                                speed: speed,
                                playerPos: event.data.get("playerPos"),
                                damage: event.data.get("damage"),
                                enemy: true,
                                lifespan: 3000
                            }
                        )
                    }
                    break;

                case "GOBLIN_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                        this.healthPoints -= event.data.get("damage");
                        //this.emitter.fireEvent("PLAYER_HIT");
                        (<PlayerController>this.player.ai).changeState("hurt");
                    }
                    break;

                case "ARROW_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                        // remove arrow
                        this.healthPoints -= event.data.get("damage");
                        //this.emitter.fireEvent("PLAYER_HIT");
                        (<PlayerController>this.player.ai).changeState("hurt");
                    }
                    break;

                case "PLAYER_MELEE_ATTACK":
                    {
                        let pos = event.data.get("pos")
                        let hitbox = new AABB(pos, new Vec2(15, 15));
                        for(let i = 0; i < this.enemies.length; i++) {
                            if(this.enemies[i].collisionShape !== null){ 
                                if(hitbox.containsPoint(this.enemies[i].position)){
                                    (<EnemyController>this.enemies[i].ai).damage(event.data.get("damage"));
                                }
                            }
                        }

                    }
                    break;

                case "PLAYER_RANGED_ATTACK":
                    {
                        let arrow = this.add.sprite("arrow", "primary");
                        let speed = event.data.get("speed");
                        let direction = event.data.get("direction");
                        arrow.scale = new Vec2(0.5, 0.5);
                        arrow.position = event.data.get("firePos");
                        arrow.rotation = Vec2.RIGHT.angleToCCW(direction);
                        arrow.addPhysics();
                        arrow.addAI(ProjectileController,
                            {
                                direction: direction,
                                speed: speed,
                                damage: 30,
                                enemy: false,
                                lifespan: 1000,
                                enemies: this.enemies
                            }
                        )
                        arrow.setGroup("playerAttack");
                    }
                    break;

                case "ENEMY_HIT":
                    {
                        let enemy = event.data.get("target");
                        let damage = event.data.get("damage");
                        (<EnemyController>enemy.ai).damage(damage);
                    }
                    break;

                case "HEALTH_POT":
                    {
                        let pot = event.data.get("pot");
                        pot.destroy();
                        this.healthPoints += 30;
                    }
                    break;

                case "LEVEL_END":
                    {
                        // next level animation
                        // go to next level
                    }
            }
        }

        // handle player death

        //update hp and xp
        if(this.healthPoints < 0) { 
            this.healthPoints = 0;
        }
        else if(this.healthPoints > 100) {
            this.healthPoints = 100;
        }
        else if(this.experiencePoints >= 100) {
            this.experiencePoints = 0;
        }

        if(this.healthPoints >= 0) {
            this.hpbar.scale = new Vec2(this.healthPoints / 100, 1);
        }

        this.xpbar.scale = new Vec2(this.experiencePoints / 100, 1);

        /*if(this.alive) {
            if(this.healthPoints <= 0) {
                this.player.animation.play("DEATH");
                this.deathStart = Date.now();
                this.alive = false;
            }
        }
        else {
            if(Date.now() - this.deathStart > this.deathAnimationLength) {
                this.player.destroy();
            }
        }*/

        if(this.alive) {
            if(this.healthPoints <= 0) {
                this.alive = false;
                (<PlayerController>this.player.ai).changeState("death");
            }
        }

        if(Input.isKeyJustPressed("m")) {
            this.sceneManager.changeToScene(MainMenu, {}, {});
        }

    }

    protected initLayers() {
        this.addUILayer("UIBackground");
        this.addUILayer("UIForeground");
        this.addLayer("primary", 10);
        this.addLayer("attacks", 11);
    }

    protected initPlayer(): void {
        this.player = this.add.animatedSprite("knight", "primary");
        this.player.position.set(this.playerSpawn.x * 32 + 16, this.playerSpawn.y * 32 + 16);
        this.player.animation.play("IDLE");
        this.player.addPhysics(new AABB(this.player.position, new Vec2(8, 14)));
        this.player.addAI(PlayerController,
            {
                speed: 75,
                attackLayer: this.getLayer("attacks"),
                emitter: new Emitter(),
                receiver: new Receiver(),
                arrow: this.add.sprite("arrow", "attacks"),
                scene: this,
                pots: this.healthpots
            }
        )
        this.player.setGroup("player");
    }

    protected addEnemy(spriteKey: string, pos: Vec2, options: Record<string, any>) {
        //Creates skeleton archer
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(pos.x * 32 + 16, pos.y * 32 + 16);
        enemy.addAI(EnemyController, options)
        enemy.addPhysics();
        enemy.setGroup("enemy");
        enemy.setTrigger("playerAttack", "ENEMY_HIT", null);
        this.enemies.push(enemy);
    }

    protected addHealthPotion(pos: Vec2) {
        let healthpot = this.add.sprite("healthpot", "primary");
        healthpot.position.set(pos.x * 32 + 16, pos.y * 32 + 16);
        this.healthpots.push(healthpot);
    }

    protected addUI() {
        //UI CURRENTLY ZOOMED IN
        this.hpbar = this.add.sprite("healthbar", "UIForeground")
        this.xpbar = this.add.sprite("xpbar", "UIForeground")
        this.hpbarBorder = this.add.sprite("healthbarBorder", "UIBackground")
        this.xpbarBorder = this.add.sprite("xpbarBorder", "UIBackground")

        this.hpbar.position = new Vec2(50, 20);
        this.hpbarBorder.position = new Vec2(50, 20);
        this.xpbar.position = new Vec2(50, 26);
        this.xpbarBorder.position = new Vec2(50, 26);

        this.xpbar.scale = new Vec2(0.05, 1);
    }

}