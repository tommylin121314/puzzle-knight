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

    private goblinPos = [new Vec2(3, 8), new Vec2(5, 9), new Vec2(2, 14), new Vec2(12, 7), new Vec2(19, 3), new Vec2(8, 17), new Vec2(10, 19), new Vec2(20, 12), new Vec2(22, 19)];
    private skeletonPos = [new Vec2(14, 3), new Vec2(2, 10), new Vec2(17, 7), new Vec2(23, 2), new Vec2(10, 13), new Vec2(7, 13), new Vec2(2, 22), new Vec2(2, 23), new Vec2(23, 15), new Vec2(23, 23), new Vec2(23, 6)];
    private healthpotsPos = [new Vec2(9, 17),new Vec2(23, 6)];
    private signs = [new Vec2(3 * 32, 22 * 32)];

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/purple_dungeon_level.json");
        
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(3,3);

        this.keyPos = [new Vec2(20, 13), new Vec2(23, 2)];
        this.doorPos = new Vec2(12 * 32, 11 * 32);

        this.nextScene = BossRoom1;

        super.startScene();
        this.mapType = 'castle';

        let tilemapsLayer = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapsLayer[1].getItems()[0];
        this.ground = <OrthogonalTilemap>tilemapsLayer[0].getItems()[0];

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

        this.signs.forEach(signPos => {
            this.addDecor("sign", signPos, new Vec2(0.6,0.6));
        });

        this.keyPos.forEach(pos => {
            this.addKeys(pos);
        })

        this.addDoor();

        this.forced = [new Rect(new Vec2(3 * 32, 3 * 32), new Vec2(64, 64))];
        this.optional = [new Rect(new Vec2(14 * 32, 7 * 32), new Vec2(40, 40))];
        this.dialogueList = [
            ["Entering Ice Dungeon: Chamber One..."],
            ["Watch out. The ice is slipper."]
        ];

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