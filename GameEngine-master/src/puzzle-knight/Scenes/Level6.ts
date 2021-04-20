import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameLevel from "./GameLevel";

export default class Level6 extends GameLevel {

    private skeletonPos: Array<Vec2> = [new Vec2(26, 45), new Vec2(27, 45)];
    private goblinPos: Array<Vec2> = [new Vec2(24, 45), new Vec2(25, 46)];
    private healthpotsPos: Array<Vec2> = [new Vec2(25, 48)];

    private walls: OrthogonalTilemap;

    loadScene() {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/level_6.json");
        
    }

    unloadScene() {

    }

    startScene() {
        this.playerSpawn = new Vec2(25, 45);

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