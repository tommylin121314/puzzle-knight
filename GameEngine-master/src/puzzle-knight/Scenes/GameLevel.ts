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

export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;

    // healthbar and exp bar
    protected healthPoints: number = 100;
    protected experiencePoints: number = 0;
    protected hpbar: Sprite;
    protected hpbarBorder: Sprite;
    protected xpbar: Sprite;
    protected xpbarBorder: Sprite;

    // Stuff to end the level and go to the next level
    /*protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;*/

    //enemies
    private skeletonArcher: AnimatedSprite;

    //walls
    walls: OrthogonalTilemap;

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
    }

    startScene(): void {
        this.initLayers();
        this.initPlayer();
        this.subscribeToEvents();
        this.addUI();
        this.initViewport();
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
                                damage: event.data.get("damage")
                            }
                        )
                    }
                    break;

                case "GOBLIN_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                        console.log("Event: GOBLIN HIT PLAYER, " + event.data.get("damage") + " damage taken");
                        this.healthPoints -= event.data.get("damage");
                        console.log("Current HP: " + this.healthPoints);
                    }
                    break;

                case "ARROW_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                        // remove arrow
                        console.log("Event: ARROW HIT PLAYER, " + event.data.get("damage") + " damage taken");
                        this.healthPoints -= event.data.get("damage");
                        console.log("Current HP: " + this.healthPoints);
                    }
                    break;

                case "PLAYER_MELEE_ATTACK":
                    {

                    }
                case "PLAYER_RANGED_ATTACK":
                    {

                    }
                case "HEALTH_POTION_OBTAINED":
                    {
                        // player gains health
                    }
                case "LEVEL_START":
                    {
                        // Re-enable controls
                        Input.enableInput();
                    }
                case "LEVEL_END":
                    {
                        // next level animation
                        // go to next level
                    }
            }
        }

        // handle player death

        //update hp and xp
        this.hpbar.scale = new Vec2(this.healthPoints / 100, 1);
        this.xpbar.scale = new Vec2(this.healthPoints / 100, 1);
    }

    protected initLayers() {
        this.addUILayer("UIBackground");
        this.addUILayer("UIForeground");
        this.addLayer("primary", 10);
        this.addLayer("attacks", 11);
    }

    protected initPlayer(): void {
        this.player = this.add.animatedSprite("knight", "primary");
        this.player.position.set(this.playerSpawn.x, this.playerSpawn.y);
        this.player.animation.play("IDLE");
        this.player.addPhysics(new AABB(this.player.position, new Vec2(8, 14)));
        this.player.addAI(PlayerController,
            {
                speed: 75,
                attackLayer: this.getLayer("attacks"),
                emitter: new Emitter(),
                arrow: this.add.sprite("arrow", "attacks"),
                scene: this
            }
        )
    }

    protected addEnemy(spriteKey: string, pos: Vec2, options: Record<string, any>): void {
        //Creates skeleton archer
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(pos.x, pos.y);
        enemy.addAI(EnemyController, options)
        enemy.addPhysics();
    }

    protected addUI() {
        //UI CURRENTLY ZOOMED IN
        this.hpbar = this.add.sprite("healthbar", "UIForeground")
        this.xpbar = this.add.sprite("xpbar", "UIForeground")
        this.hpbarBorder = this.add.sprite("healthbarBorder", "UIBackground")
        this.xpbarBorder = this.add.sprite("xpbarBorder", "UIBackground")

        this.hpbar.position = new Vec2(200, 200);
        this.hpbarBorder.position = new Vec2(200, 200);
        this.xpbar.position = new Vec2(200, 230);
        this.xpbarBorder.position = new Vec2(200, 230);

        this.xpbar.scale = new Vec2(0.05, 1);
    }

}