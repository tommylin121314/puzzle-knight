import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import EventQueue from "../../Wolfie2D/Events/EventQueue";
import Input from "../../Wolfie2D/Input/Input";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import DragonController from "../AI/Dragon/DragonController";
import ProjectileController from "../AI/Other/ProjectileController";
import Dialogue from "../GameSystem/Dialogue";
import GameLevel from "./GameLevel";

export default class BossRoom1 extends GameLevel {

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/BossRoomMap.json");
        this.load.spritesheet("dragon", "assets/spritesheets/dragon.json");
        this.load.image("fireball", "assets/sprites/Fireball.png");
        this.load.image("bluefireball", "assets/sprites/BlueFireBall.png");
        this.load.image("firenuke", "assets/sprites/FireNuke.png");
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(12,12);

        super.startScene();

        let tilemapsLayer = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapsLayer[1].getItems()[0];
        this.ground = <OrthogonalTilemap>tilemapsLayer[0].getItems()[0];

        let tilemapSize = this.walls.size;

        this.initPlayer();
        this.initViewport();
        this.viewport.setCenter(new Vec2(8 * 32, 8 * 32));
        this.viewport.setHalfSize(new Vec2(8*32, 6*32));
        this.viewport.setBounds(0, 0, 16*32, 16*32);

        this.forced = [];
        this.optional = [];
        this.dialogueList = [

        ];

        let dragon = this.add.animatedSprite("dragon", "primary");
        dragon.position = new Vec2(8 * 32,8  * 32 - 64);
        dragon.scale = new Vec2(1.7, 1.7);
        dragon.addAI(DragonController, {
            playerPos: this.player.position,
            attackLayer: this.layers.get("attackLayer")
        })

        this.receiver.subscribe("DRAGONLEFTATTACK");
        this.receiver.subscribe("DRAGONRIGHTATTACK");
        this.receiver.subscribe("DRAGONROARATTACK1");
        this.receiver.subscribe("DRAGONROARATTACK2");
        this.receiver.subscribe("FIREBALLHIT");

        // this.dialogue = new Dialogue(this.sentences, this, this.textBox, this.text);

    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        // if(Input.isKeyJustPressed("r")) {
        //     if(this.dialogue.isStarted)
        //         this.dialogue.getNextLine();
        //     else {
        //         this.dialogue.startDialogue();
        //     }
        // }


    }

}