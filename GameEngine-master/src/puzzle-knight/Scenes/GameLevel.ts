import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import PlayerController from "../AI/Player/PlayerController";
import EnemyController from "../AI/Enemy/EnemyController";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import ArrowController from "../AI/Other/ArrowController";
import Timer from "../../Wolfie2D/Timing/Timer";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";

export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;

    // Labels for the UI
    protected static healthPoints: number = 100;
    protected hpLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    //enemies
    private skeletonArcher: AnimatedSprite;

    //walls
    private walls: OrthogonalTilemap;

    loadScene() {
        this.load.spritesheet("skeletonArcher", "assets/spritesheets/skeletonArcher.json");
        this.load.spritesheet("goblin", "assets/spritesheets/goblin.json");
        this.load.spritesheet("knight", "assets/spritesheets/knight.json");
        this.load.tilemap("level", "assets/tilemaps/test-dungeon.json");
        this.load.spritesheet("bow", "assets/spritesheets/skeletonBow.json");
        this.load.image("arrow", "assets/sprites/Arrow.png");
    }

    startScene(): void {
        this.initLayers();
        this.receiver.subscribe("SKELETON_ATTACK");
        this.initPlayer();
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
                        arrow.addAI(ArrowController,
                            {
                                direction: direction,
                                speed: speed
                            }
                        )
                    }
                    break;
                case "GOBLIN_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                    }
                    break;
                case "ARROW_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                        // remove arrow
                    }
                case "ENEMY_DIED":
                    {
                        // enemy death animation done, remove it
                    }
                case "PLAYER_HIT_ENEMY":
                    {
                        // enemy loses health
                        // play enemy hurt animation
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
    }

    protected initLayers() {
        this.addLayer("primary", 10);
        this.addLayer("attacks", 11);
    }

    protected initPlayer(): void {
        this.player = this.add.animatedSprite("knight", "primary");
        this.player.position.set(7*32, 5*32);
        this.player.animation.play("IDLE");
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
        this.player.addAI(PlayerController,
            {
                speed: 75
            }
        )
    }

    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        //Creates skeleton archer
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x*32, tilePos.y*32);
        enemy.addAI(EnemyController, aiOptions)
        enemy.addPhysics();
        console.log(enemy);
    }

}