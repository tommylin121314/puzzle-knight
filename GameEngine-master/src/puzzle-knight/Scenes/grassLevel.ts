import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import EventQueue from "../../Wolfie2D/Events/EventQueue";
import Input from "../../Wolfie2D/Input/Input";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Dialogue from "../GameSystem/Dialogue";
import BossRoom1 from "./BossRoom1";
import GameLevel from "./GameLevel";

export default class grassLevel extends GameLevel {

    private goblinPos = [new Vec2(2, 18), new Vec2(7, 18), new Vec2(15, 22), new Vec2(20, 22), new Vec2(2, 10), new Vec2(6, 11), new Vec2(9, 1), new Vec2(17, 1), new Vec2(18, 3)];
    private skeletonPos = [new Vec2(1, 1), new Vec2(2, 1), new Vec2(15, 7), new Vec2(23, 1), new Vec2(12, 5), new Vec2(14, 18)];
    private healthpotsPos = [new Vec2(11, 5),new Vec2(23, 23)];
    private signs = [new Vec2(3 * 32, 22 * 32)];

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/grass_level.json");
        
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(1,22);

        this.keyPos = [new Vec2(1, 1), new Vec2(23, 8)];
        this.doorPos = new Vec2(21 * 32, 2 * 32);

        this.nextScene = BossRoom1;

        super.startScene();
        this.mapType = 'grass';

        let tilemapsLayer = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapsLayer[1].getItems()[0];
        this.ground = <OrthogonalTilemap>tilemapsLayer[0].getItems()[0];

        let tilemapSize = this.walls.size;

        this.healthpotsPos.forEach(pos => {
            this.addHealthPotion(pos);
        });

        this.initPlayer();
        this.initViewport();
        this.initDialogueUI();

        this.viewport.setBounds(0, -20, tilemapSize.x, tilemapSize.y);

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

        this.signs.forEach(signPos => {
            this.addDecor("sign", signPos, new Vec2(0.6,0.6));
        });

        this.keyPos.forEach(pos => {
            this.addKeys(pos);
        })

        this.addDoor();
        this.numKeys = 2;

        this.forced = [new Rect(new Vec2(1 * 32, 23 * 32), new Vec2(64, 64))];
        this.optional = [new Rect(new Vec2(3 * 32, 22 * 32), new Vec2(40, 40))];
        this.dialogueList = [
            ["Entering Grassy Plains..."],
            ["This plain is full of life.", "It'll be difficult to navigate with all these bushes..."]
        ];

        this.overlay.position = this.overlay.position.scale(2,2);
        this.text.position = this.overlay.position.clone().add(new Vec2(0, this.overlay.size.y / 3));
        this.textBox.position = this.overlay.position.clone().add(new Vec2(0, this.overlay.size.y / 3));
        console.log("VIEWPORT CENTER: " + this.viewport.getCenter().toString());
        console.log("OVERLAY CENTER: " + this.overlay.position.toString());
        console.log("VP SIZE: " + this.viewport.getHalfSize().toString());
        console.log("OL SIZE: " + this.overlay.size.toString());

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