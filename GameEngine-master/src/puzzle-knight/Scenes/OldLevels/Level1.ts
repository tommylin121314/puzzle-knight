import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import EventQueue from "../../../Wolfie2D/Events/EventQueue";
import Input from "../../../Wolfie2D/Input/Input";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../../Wolfie2D/Nodes/Graphics/Rect";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import Dialogue from "../../GameSystem/Dialogue";
import GameLevel from "../GameLevel";

export default class Level1 extends GameLevel {

    //private skeletonPos = [new Vec2(2, 2), new Vec2(19, 4), new Vec2(31, 2), new Vec2(47, 30), new Vec2(18, 39), new Vec2(40, 39), new Vec2(46, 47), new Vec2(13, 23), new Vec2(7, 35), new Vec2(2, 18), new Vec2(13, 40), new Vec2(13, 46), new Vec2(4, 40), new Vec2(4, 46)];
    //private goblinPos = [new Vec2(3, 4), new Vec2(10, 3), new Vec2(22, 2), new Vec2(40, 11), new Vec2(32, 13), new Vec2(38, 17), new Vec2(40, 25), new Vec2(25, 29),, new Vec2(33, 25), new Vec2(33, 29),, new Vec2(28, 44), new Vec2(45, 39), new Vec2(17, 35)];
    private healthpotsPos = [new Vec2(1, 1), new Vec2(25,1), new Vec2(36,23), new Vec2(1,17), new Vec2(19,35), new Vec2(40,39), new Vec2(46,42)];
    private goblinPos = [new Vec2(40, 10)];
    private skeletonPos = [new Vec2(42, 10)];

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/level_1.json");
        
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(47,2);

        super.startScene();
        

        let tilemapsLayer = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapsLayer[1].getItems()[0];
        let tilemapSize = this.walls.size;
        this.viewport.setBounds(0, -20, tilemapSize.x, tilemapSize.y);

        this.healthpotsPos.forEach(pos => {
            this.addHealthPotion(pos);
        });

        this.initPlayer();
        this.initViewport();

        this.skeletonPos.forEach(pos => {
            this.addEnemy("skeletonArcher", pos, {
                attackLayer: this.getLayer("attacks"),
                speed: 15,
                playerPos: this.player.position,
                skeleton: true,
                originalPos: new Vec2(pos.x * 32, pos.y * 32),
                bow: this.add.animatedSprite("bow", "attacks"),
                arrow: this.add.sprite("arrow", "attacks"),
                walls: this.walls
            })
        });

        this.goblinPos.forEach(pos => {
            this.addEnemy("goblin", pos, {
                speed: 25,
                playerPos: this.player.position,
                goblin: true,
                originalPos: new Vec2(pos.x * 32, pos.y * 32),
                walls: this.walls
            })
        })

        this.forced = [];
        this.optional = [];
        this.dialogueList = [];

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