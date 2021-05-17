import GameLevel from "./GameLevel";
import BossRoom1 from "./BossRoom1";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import DragonEntrance from "./DragonEntrance";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import PlayerController from "../AI/Player/PlayerController";

export default class Ice2 extends GameLevel {
    private goblinPos = [new Vec2(13, 22), new Vec2(11, 21), new Vec2(5, 10), new Vec2(6, 8), new Vec2(8, 9), new Vec2(17, 9), new Vec2(19, 13)];
    private skeletonPos = [new Vec2(4, 13), new Vec2(13, 18), new Vec2(13, 4), new Vec2(14, 5), new Vec2(17, 18), new Vec2(21, 22)];
    private healthpotsPos = [new Vec2(15, 12), new Vec2(23, 4), new Vec2(15, 14), new Vec2(21, 15)];
    private signs = [new Vec2(20 * 32, 39 * 32)];
    
    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/Ice-2.json");

        //LOADING AUDIO
        this.load.audio("bow", "assets/sounds/arrow_sound.wav");
        this.load.audio("melee", "assets/sounds/swish.wav");
        this.load.audio("hit", "assets/sounds/impact.wav");
        this.load.audio("dragon", "assets/sounds/dragon.wav");
        this.load.audio("walk", "assets/sounds/walk3.wav");

    }

    unloadScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: 'music'});

    }
    startScene() {
        this.playerSpawn = new Vec2(25,46);

        this.keyPos = [new Vec2(7, 37), new Vec2(44, 42)];
        this.doorPos = new Vec2(25 * 32 + .5, 34 * 32);

        this.nextScene = DragonEntrance;

        super.startScene();
        this.mapType = 'ice';

        let tilemapsLayer = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapsLayer[1].getItems()[0];
        this.ground = <OrthogonalTilemap>tilemapsLayer[0].getItems()[0];

        let tilemapSize = this.walls.size;
        this.viewport.setBounds(0, -20, tilemapSize.x, tilemapSize.y);

        this.healthpotsPos.forEach(pos => {
            this.addHealthPotion(pos);
        });

        this.initPlayer();
        this.viewport.setCenter(600,400);
        this.initViewport();
        this.initDialogueUI();

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

        this.overlay.position = new Vec2(this.viewport.getCenter().x/2, this.viewport.getCenter().y/2)

        this.forced = [new Rect(new Vec2(25 * 32, 47 * 32), new Vec2(64, 64)), new Rect(new Vec2(20 * 32, 39 * 32), new Vec2(40, 40))];
        this.optional = [];
        this.dialogueList = [
            ["Entering Ice Dungeon: Chamber Two..."],
            ["You MUST break all the ice by walking on it. Tread carefully."]
        ];
        (<PlayerController>this.player.ai).walls.setTileAtRowCol(new Vec2(30, 39), 6);
    }
    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        // open right wall of main room if all keys collected
        if(this.hasDoor) {
            if(this.keysCollected < this.numKeys) {
                if ((<PlayerController>this.player.ai).walls.getTileAtRowCol(new Vec2(30, 39)) == 6) return;
                (<PlayerController>this.player.ai).walls.setTileAtRowCol(new Vec2(30, 39), 6);
            }
            else {
                if ((<PlayerController>this.player.ai).walls.getTileAtRowCol(new Vec2(30, 39)) == 0) return;
                (<PlayerController>this.player.ai).walls.setTileAtRowCol(new Vec2(30, 39), 0);
            }
        }
    }

    // handleIceBreak() {
    //     if (this.player.)
    // }
}