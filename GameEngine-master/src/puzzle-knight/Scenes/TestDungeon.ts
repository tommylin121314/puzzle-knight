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
import PlayerController from "../AI/playerController";

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
    }

    startScene() {

        this.addLayer("primary", 10);

        //adds tile map and walls
        let tilemapLayers = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        //Sets up viewport constraints
        let tilemapSize: Vec2 = this.walls.size;
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        //Creates skeleton archer
        this.skeletonArcher = this.add.animatedSprite("skeletonArcher", "primary");
        this.skeletonArcher.position.set(5*32, 5*32);
        this.skeletonArcher.animation.play("WALK");
        console.log(this.skeletonArcher);

        //Initializes player
        this.initializePlayer();
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(3);
    }

    initializePlayer() {
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

    updateScene() {

    }
}