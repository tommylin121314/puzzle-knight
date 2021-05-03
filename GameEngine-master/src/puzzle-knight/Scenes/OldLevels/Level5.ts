import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameLevel from "./GameLevel";

export default class Level5 extends GameLevel {

    private skeletonPos: Array<Vec2> = [new Vec2(2, 2), new Vec2(6, 4), new Vec2(19, 21), new Vec2(11, 13), new Vec2(15, 7)];
    private goblinPos: Array<Vec2> = [new Vec2(11, 21), new Vec2(19, 21), new Vec2(2, 15), new Vec2(15, 2), new Vec2(6, 9)];
    private healthpotsPos: Array<Vec2> = [new Vec2(11, 13), new Vec2(22, 5), new Vec2(10, 2), new Vec2(1, 13)];

    private walls: OrthogonalTilemap;

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/level_5.json");
        
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(3, 22);

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