import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import EventQueue from "../../Wolfie2D/Events/EventQueue";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Dialogue from "../GameSystem/Dialogue";
import BossRoom1 from "./BossRoom1";
import EnterBossCS from "./EnterBossCS";
import GameLevel from "./GameLevel";

export default class DragonEntrance extends GameLevel {

    private goblinPos:Array<Vec2>;
    private skeletonPos:Array<Vec2>;
    private healthpotsPos:Array<Vec2>;
    private signs:Array<Vec2>;

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/DragonEntrance.json");
    }

    unloadScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: 'music'});

    }

    startScene() {
        this.goblinPos = [];
        this.skeletonPos = [];
        this.healthpotsPos = [];
        this.signs = [];

        this.playerSpawn = new Vec2(2,5);

        this.keyPos = [];
        this.doorPos = new Vec2(9 * 32 + 16, 2 * 32);

        this.nextScene = EnterBossCS;

        super.startScene();

        let tilemapsLayer = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapsLayer[1].getItems()[0];
        this.ground = <OrthogonalTilemap>tilemapsLayer[0].getItems()[0];

        let tilemapSize = this.walls.size;

        this.initPlayer();
        this.viewport.setCenter(300, 200);
        this.initViewport();
        this.initDialogueUI();

        this.viewport.setBounds(0, -20, tilemapSize.x, tilemapSize.y);

        this.viewport.setZoomLevel(4);
        this.addDoor();
        this.numKeys = 0;

        this.forced = [];
        this.optional = [];
        this.dialogueList = [
        ];

    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

    }

}