import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameLevel from "./GameLevel";

export default class Level2 extends GameLevel {

    private skeletonPos: Array<Vec2> = [new Vec2(7, 3), new Vec2(16, 3), new Vec2(23, 3), new Vec2(8, 17), new Vec2(15, 16)];
    private goblinPos: Array<Vec2> = [new Vec2(5, 20), new Vec2(5, 10), new Vec2(21, 15)];
    private healthpotsPos: Array<Vec2> = [new Vec2(23, 3), new Vec2(13, 16), new Vec2(6, 1)];

    private walls: OrthogonalTilemap;

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/level_2.json");
        
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(23, 23);

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
                arrow: this.add.sprite("arrow", "attacks")
            })
        });

        this.goblinPos.forEach(pos => {
            this.addEnemy("goblin", pos, {
                speed: 25,
                playerPos: this.player.position,
                goblin: true,
                originalPos: pos
            })
        })

    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }
}