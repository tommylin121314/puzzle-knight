import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameLevel from "./GameLevel";

export default class Level4 extends GameLevel {

    private skeletonPos: Array<Vec2> = [new Vec2(16, 9), new Vec2(15, 16), new Vec2(20, 19), new Vec2(2, 21), new Vec2(3, 9)];
    private goblinPos: Array<Vec2> = [new Vec2(8, 6), new Vec2(20, 6), new Vec2(3, 13), new Vec2(9, 16)];
    private healthpotsPos: Array<Vec2> = [new Vec2(20, 14), new Vec2(3, 9), new Vec2(12, 18)];

    private walls: OrthogonalTilemap;

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/level_4.json");
        
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(1, 2);

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
                originalPos: pos,
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