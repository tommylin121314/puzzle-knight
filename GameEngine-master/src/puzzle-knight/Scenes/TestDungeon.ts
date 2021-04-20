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

import Emitter from "../../Wolfie2D/Events/Emitter";

export default class TestDungeon extends Scene {

    //player
    private player: AnimatedSprite;

    //enemies
    private skeletonArcher: AnimatedSprite;

    //walls
    private walls: OrthogonalTilemap;

    loadScene() {
        this.load.spritesheet("skeletonArcher", "assets/spritesheets/skeletonArcher.json");
        this.load.spritesheet("knight", "assets/spritesheets/knight.json");
        this.load.tilemap("level", "assets/tilemaps/test-dungeon.json");
        this.load.spritesheet("bow", "assets/spritesheets/skeletonBow.json");
        this.load.image("arrow", "assets/sprites/Arrow.png");
    }

    startScene() {

        this.addLayer("primary", 10);
        this.addLayer("attacks", 11);

        this.receiver.subscribe("SKELETON_ATTACK");
        this.receiver.subscribe("PLAYER_RANGED_ATTACK");
        this.receiver.subscribe("PLAYER_MELEE_ATTACK");

        //adds tile map and walls
        let tilemapLayers = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        //Sets up viewport constraints
        let tilemapSize: Vec2 = this.walls.size;
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

         //Initializes player
         this.initializePlayer();
         this.viewport.follow(this.player);
         this.viewport.setZoomLevel(2);


        //Creates skeleton archer
        this.skeletonArcher = this.add.animatedSprite("skeletonArcher", "primary");
        this.skeletonArcher.position.set(5*32, 5*32);
        this.skeletonArcher.addAI(EnemyController, {
            attackLayer: this.getLayer("attacks"),
            speed: 15,
            playerPos: this.player.position,
            skeleton: true,
            originalPos: new Vec2(this.skeletonArcher.position.x, this.skeletonArcher.position.y),
            bow: this.add.animatedSprite("bow", "attacks"),
            arrow: this.add.sprite("arrow", "attacks")
        })
        this.skeletonArcher.addPhysics();
        console.log(this.skeletonArcher);

    }

    initializePlayer() {
        this.player = this.add.animatedSprite("knight", "primary");
        this.player.position.set(7*32, 5*32);
        this.player.animation.play("IDLE");
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
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

    updateScene() {
        while(this.receiver.hasNextEvent()) {

            //gets next event in the event queue
            let event = this.receiver.getNextEvent();

            switch(event.type) {
                case "SKELETON_ATTACK":
                    {
                        let arrow = this.add.sprite("arrow", "attacks");
                        let speed = event.data.get("speed");
                        let direction = event.data.get("direction");
                        arrow.scale = new Vec2(0.5, 0.5);
                        arrow.position = event.data.get("firePos");
                        arrow.rotation = Vec2.RIGHT.angleToCCW(direction);
                        arrow.addPhysics();
                        /*arrow.addAI(ArrowController,
                            {
                                direction: direction,
                                speed: speed
                            }
                        )*/
                    }
                    case "PLAYER_RANGED_ATTACK":
                        {
                            
                        }
                    case "PLAYER_MELEE_ATTACK":
                        {
                            
                            
                        }
                    
            }
        }
    }
}