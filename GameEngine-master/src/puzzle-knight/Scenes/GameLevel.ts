import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import PlayerController from "../AI/Player/PlayerController";
import EnemyController from "../AI/Enemy/EnemyController";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import ProjectileController from "../AI/Other/ProjectileController";
import Timer from "../../Wolfie2D/Timing/Timer";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Game from "../../Wolfie2D/Loop/Game";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Receiver from "../../Wolfie2D/Events/Receiver";
import MainMenu from "./MainMenu";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Dialogue from "../GameSystem/Dialogue";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;
    private deathStart: number;
    private deathAnimationLength: number = 1000;

    // healthbar and exp bar
    protected healthPoints: number = 500;
    protected experiencePoints: number = 0;
    protected hpbar: Sprite;
    protected hpbarBorder: Sprite;
    protected xpbar: Sprite;
    protected xpbarBorder: Sprite;
    public alive: boolean = true;

    protected walls: OrthogonalTilemap;
    protected ground: OrthogonalTilemap;
    public mapType: string; //"ice", "boss", "grass", "fire", "castle"
    
    protected forced: Array<Rect>;
    protected optional: Array<Rect>;
    protected dialogueList: Array<Array<string>>;
    protected dialogue: Dialogue;
    protected textBox: Rect;
    protected text: Label;
    protected overlay: Rect;
    public isTalking: boolean;
    
    protected levelEndArea: Rect;
    protected doorPos: Vec2;
    protected keyPos: Array<Vec2>;
    protected keys: Array<AnimatedSprite>;
    protected nextScene: new (...args: any) => Scene;
    protected hasDoor: boolean;
    protected door: Sprite;
    protected endLevelTime: number;
    protected keysCollected: number = 0;
    protected numKeys: number;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    levelTransitionScreen: Rect;

    //enemies
    protected enemies: Array<AnimatedSprite>;

    //health potions
    protected healthpots: Array<Sprite>;

    loadScene() {
        this.load.spritesheet("skeletonArcher", "assets/spritesheets/skeletonArcher.json");
        this.load.spritesheet("goblin", "assets/spritesheets/goblin.json");
        this.load.spritesheet("knight", "assets/spritesheets/knight.json");
        this.load.spritesheet("bow", "assets/spritesheets/skeletonBow.json");
        this.load.image("arrow", "assets/sprites/Arrow.png");
        this.load.image("healthbar", "assets/sprites/HealthBar.png");
        this.load.image("healthbarBorder", "assets/sprites/HealthBarBorder.png");
        this.load.image("xpbar", "assets/sprites/XPBar.png");
        this.load.image("xpbarBorder", "assets/sprites/XPBarBorder.png");
        this.load.image("healthpot", "assets/sprites/healthPot.png");
        this.load.image("sign", "assets/sprites/Sign-Ground.png");
        this.load.spritesheet("key", "assets/spritesheets/Key.json");
        this.load.image("door", "assets/sprites/Door.png");
        this.load.audio("bow", "assets/sounds/arrow_sound.wav");
        this.load.audio("melee", "assets/sounds/swish.wav");
        this.load.audio("hit", "assets/sounds/impact.wav");
        this.load.audio("dragon", "assets/sounds/dragon.wav");
        this.load.audio("walk", "assets/sounds/walk3.wav");
    }

    startScene(): void {
        this.initLayers();
        this.subscribeToEvents();
        this.addUI();
        this.enemies = [];
        this.healthpots = [];
        this.keys = [];
        this.endLevelTime = Date.now();
        this.numKeys = 2;
        this.hasDoor = true;

        this.sceneOptions.physics = {
            groups: ["enemy", "player", "enemyAttack", "playerAttack"],
            collisions: [
                [0, 0, 0, 1],
                [0, 0, 1, 0],
                [0, 1, 0, 0],
                [1, 0, 0, 0]
            ]
        }

    }

    initViewport() {
        this.viewport.setZoomLevel(2);
        this.viewport.follow(this.player);
    }

    subscribeToEvents() {
        this.receiver.subscribe("ARROW_HIT_PLAYER");
        this.receiver.subscribe("GOBLIN_HIT_PLAYER");
        this.receiver.subscribe("SKELETON_ATTACK");
        this.receiver.subscribe("PLAYER_RANGED_ATTACK");
        this.receiver.subscribe("PLAYER_MELEE_ATTACK");
        this.receiver.subscribe("ENEMY_HIT");
        this.receiver.subscribe("HEALTH_POT");
        this.receiver.subscribe("PLAYER_ENTERED_LEVEL_END");
        this.receiver.subscribe("PLAYER_DIED");
    }

    initDialogueUI() {
        this.overlay = <Rect>this.add.graphic(GraphicType.RECT, "UIBackground", {
            position: new Vec2(this.viewport.getCenter().x, this.viewport.getCenter().y),
            size: new Vec2(this.viewport.getHalfSize().x * 2, this.viewport.getHalfSize().y * 2)
        })
        this.overlay.color = new Color(0, 0, 0, 0.5);
        this.overlay.visible = false;

        this.textBox = <Rect>this.add.graphic(GraphicType.RECT, "UIBackground", {
            position: new Vec2(this.viewport.getCenter().x/2, this.viewport.getCenter().y/7*6),
            size: new Vec2(500, 50)
        });
        this.textBox.color = new Color(255,239,213,1);
        this.textBox.borderWidth = 10;
        this.textBox.borderColor = new Color(202,164,114,1);
        this.textBox.visible = false;

        this.text = <Label>this.add.uiElement(UIElementType.LABEL, "UIForeground", {
            position: new Vec2(this.viewport.getCenter().x/2, this.viewport.getCenter().y/7*6),
            size: new Vec2(450, 40),
            text: ''
        });
        this.text.visible = false;
    }

    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if(!this.isTalking)
            switch(event.type){
                case "SKELETON_ATTACK":
                    {
                        let arrow = this.add.sprite("arrow", "attacks");
                        let speed = event.data.get("speed");
                        let direction = event.data.get("direction");
                        arrow.scale = new Vec2(0.5, 0.5);
                        arrow.position = event.data.get("firePos");
                        arrow.rotation = Vec2.RIGHT.angleToCCW(direction);
                        arrow.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
                        arrow.addAI(ProjectileController,
                            {
                                direction: direction,
                                speed: speed,
                                playerPos: event.data.get("playerPos"),
                                damage: event.data.get("damage"),
                                enemy: true,
                                lifespan: 3000
                            }
                        )
                        arrow.setTrigger("player", "ARROW_HIT_PLAYER", null);
                        arrow.setGroup("enemyAttack");
                    }
                    break;

                case "GOBLIN_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                        this.healthPoints -= event.data.get("damage");
                        //this.emitter.fireEvent("PLAYER_HIT");
                        (<PlayerController>this.player.ai).changeState("hurt");
                    }
                    break;

                case "ARROW_HIT_PLAYER":
                    {
                        // player loses health
                        // play player hurt animation
                        // remove arrow
                        this.healthPoints -= event.data.get("damage");
                        //this.emitter.fireEvent("PLAYER_HIT");
                        (<PlayerController>this.player.ai).changeState("hurt");
                    }
                    break;

                case "PLAYER_MELEE_ATTACK":
                    {
                        let pos = event.data.get("pos")
                        let hitbox = new AABB(pos, new Vec2(20, 20));
                        for(let i = 0; i < this.enemies.length; i++) {
                            if(this.enemies[i].collisionShape !== null){ 
                                if(hitbox.containsPoint(this.enemies[i].position)){
                                    (<EnemyController>this.enemies[i].ai).damage(event.data.get("damage"));
                                }
                            }
                        }

                    }
                    break;

                case "PLAYER_RANGED_ATTACK":
                    {
                        let arrow = this.add.sprite("arrow", "attacks");
                        let speed = event.data.get("speed");
                        let direction = event.data.get("direction");
                        arrow.scale = new Vec2(0.5, 0.5);
                        arrow.position = event.data.get("firePos");
                        arrow.rotation = Vec2.RIGHT.angleToCCW(direction);
                        arrow.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
                        arrow.addAI(ProjectileController,
                            {
                                direction: direction,
                                speed: speed,
                                damage: 15,
                                enemy: false,
                                lifespan: 1000,
                                enemies: this.enemies
                            }
                        )
                        arrow.setGroup("playerAttack");
                    }
                    break;

                case "ENEMY_HIT":
                    {
                        let enemy = event.data.get("target");
                        let damage = event.data.get("damage");
                        (<EnemyController>enemy.ai).damage(damage);
                    }
                    break;

                case "HEALTH_POT":
                    {
                        let pot = event.data.get("pot");
                        pot.destroy();
                        this.healthPoints += 30;
                    }
                    break;

                case "PLAYER_ENTERED_LEVEL_END":
                    {
                        if(this.hasDoor) {
                            if(this.keysCollected < this.numKeys) {
                                this.dialogue = new Dialogue(["Door is locked.", "Find all the keys"], this, this.textBox, this.text, this.overlay, false);
                                this.dialogue.startDialogue();
                            }
                            else {
                                let sceneOptions = {
                                    physics: {
                                        groups: ["enemy", "player", "enemyAttack", "playerAttack"],
                                        collisions: [
                                            [0, 0, 0, 1],
                                            [0, 0, 1, 0],
                                            [0, 1, 0, 0],
                                            [1, 0, 0, 0]
                                        ]
                                    }
                                }
                                this.sceneManager.changeToScene(this.nextScene, {}, sceneOptions);
                            }
                        }
                        else {
                            this.sceneManager.changeToScene(this.nextScene, {}, {});
                        }
                    }
                    break;

                case "DRAGONLEFTATTACK": {

                    console.log("LEFT ATTACK EVENT");
                    let direction = event.data.get("direction");
                    let firePos = event.data.get("firePos");
                    let speed = event.data.get("speed");
                    let damage = event.data.get("damage");
                    let type = event.data.get("type");

                    if(type === 0) {
                        let fireball = this.add.sprite("fireball", "attacks");
                        fireball.scale = new Vec2(0.7, 0.7);
                        fireball.position = firePos;
                        fireball.rotation = Vec2.RIGHT.angleToCCW(direction.clone());
                        fireball.addPhysics(new AABB(Vec2.ZERO, new Vec2(4, 4)));
                        fireball.addAI(ProjectileController,
                            {
                                direction: direction.clone(),
                                speed: speed,
                                damage: damage,
                                enemy: true,
                                lifespan: 2500,
                                playerPos: this.player.position
                            }
                        )
                        fireball.setTrigger("player", "FIREBALLHIT", null);
                        fireball.setGroup("enemyAttack");
                    }
                    else if(type === 1){
                        console.log("shot");
                        let fireball = this.add.sprite("bluefireball", "attacks");
                        fireball.scale = new Vec2(1, 1);
                        fireball.position = firePos;
                        fireball.rotation = Vec2.RIGHT.angleToCCW(direction.clone());
                        fireball.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
                        fireball.addAI(ProjectileController,
                            {
                                direction: direction.clone(),
                                speed: speed,
                                damage: damage,
                                enemy: true,
                                lifespan: 2500,
                                playerPos: this.player.position
                            }
                        )
                        fireball.setTrigger("player", "FIREBALLHIT", null);
                        fireball.setGroup("enemyAttack");
                    }
                    else if(type === 2) {
                        let fireball = this.add.sprite("firenuke", "attacks");
                        fireball.scale = new Vec2(2.5, 2.5);
                        fireball.position = firePos;
                        fireball.tweens.add("spin", {
                            startDelay: 0,
                            duration: 2000,
                            effects: [
                                {
                                    property: "rotation",
                                    start: 0,
                                    end: 8 * Math.PI,
                                    ease: EaseFunctionType.OUT_SINE
                                }
                            ]
                        });
                        fireball.tweens.play("spin");
                        fireball.addPhysics(new AABB(Vec2.ZERO, new Vec2(20, 20)));
                        fireball.addAI(ProjectileController,
                            {
                                direction: direction.clone(),
                                speed: speed,
                                damage: damage,
                                enemy: true,
                                lifespan: 2500,
                                playerPos: this.player.position,
                                dragonNuke: true
                            }
                        )
                        fireball.setTrigger("player", "FIREBALLHIT", null);
                        fireball.setGroup("enemyAttack");
                    }

                    break;
                }

                case "FIREBALLHIT": {
                    this.healthPoints -= event.data.get("damage");
                    (<PlayerController>this.player.ai).changeState("hurt");
                    break;
                }

                case "PLAYER_DIED": {
                    this.sceneManager.changeToScene(MainMenu, {}, {});
                    break;
                }
            }
        }


        //////CHEAT CODES////////
        if(Input.isKeyJustPressed('k')) {
            this.keysCollected = 999;
        }
        if(Input.isKeyJustPressed('l')) {
            if((<PlayerController>this.player.ai).speed === 250)
                (<PlayerController>this.player.ai).speed = 90;
            else
            (<PlayerController>this.player.ai).speed = 250;
        }
        if(Input.isKeyJustPressed('o')) {
            this.healthPoints = 100;
        }

        /////////////////////////


        // handle player death

        //update hp and xp
        if(this.healthPoints < 0) { 
            this.healthPoints = 0;
        }
        else if(this.healthPoints > 100) {
            this.healthPoints = 100;
        }
        else if(this.experiencePoints >= 100) {
            this.experiencePoints = 0;
        }

        if(this.healthPoints >= 0) {
            this.hpbar.scale = new Vec2(this.healthPoints / 100, 1);
        }

        this.xpbar.scale = new Vec2(this.experiencePoints / 100, 1);

        /*if(this.alive) {
            if(this.healthPoints <= 0) {
                this.player.animation.play("DEATH");
                this.deathStart = Date.now();
                this.alive = false;
            }
        }
        else {
            if(Date.now() - this.deathStart > this.deathAnimationLength) {
                this.player.destroy();
            }
        }*/

        if(this.alive) {
            if(this.healthPoints <= 0) {
                this.alive = false;
                (<PlayerController>this.player.ai).changeState("death");
            }
        }

        if(Input.isKeyJustPressed("m")) {
            this.sceneManager.changeToScene(MainMenu, {}, {});
        }


        //dialogue
        if(!this.isTalking)
            this.isTalking = this.checkForForcedDialogue();

        if (this.isTalking) {
            if(Input.isKeyJustPressed("r")) {
                this.dialogue.getNextLine();
            }
        }
        else {
            if(Input.isKeyJustPressed("r")) {
                for(let i = 0; i < this.optional.length; i++) {
                    if(this.optional[i].contains(this.player.position.x, this.player.position.y)) {
                        let index = i + this.forced.length;
                        this.dialogue = new Dialogue(this.dialogueList[index], this, this.textBox, this.text, this.overlay, false);
                        this.dialogue.startDialogue();
                        break;
                    }
                }
            }
        }

        //pick up keys
        if(Input.isKeyJustPressed("e")) {
            this.keys.forEach(key => {
                if(key != null)
                    if(this.player.position.clone().distanceTo(key.position) < 25) {
                        key.destroy();
                        key = null;
                        this.keysCollected++;
                    }
            });
        }

        if(this.hasDoor) {
        //check if players at the door
            if(new Rect(this.door.position.clone(), new Vec2(20, 20)).contains(this.player.position.clone().x, this.player.position.clone().y)) {
                if(Date.now() - this.endLevelTime > 3000) {
                    this.endLevelTime = Date.now();
                    this.emitter.fireEvent("PLAYER_ENTERED_LEVEL_END");
                }
            }
        }



    }

    protected initLayers() {
        this.addUILayer("UIBackground");
        this.addUILayer("UIForeground");
        this.addLayer("primary", 10);
        this.addLayer("attacks", 11);

    }

    protected initPlayer(): void {
        this.player = this.add.animatedSprite("knight", "primary");
        this.player.position.set(this.playerSpawn.x * 32 + 16, this.playerSpawn.y * 32 + 16);
        this.player.animation.play("IDLE");
        this.player.addPhysics(new AABB(this.player.position, new Vec2(8, 6)));
        this.player.colliderOffset = new Vec2(0, 12);
        this.player.setGroup("player");
        this.player.addAI(PlayerController,
            {
                speed: 90,
                attackLayer: this.getLayer("attacks"),
                emitter: new Emitter(),
                receiver: new Receiver(),
                arrow: this.add.sprite("arrow", "attacks"),
                scene: this,
                pots: this.healthpots,
                walls: this.walls,
                ground: this.ground
            }
        )
        this.player.setGroup("player");
    }

    /**
     * Initializes the level end area
     */
     protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.add(size.scaled(0.5)).scale(32), size: size.scale(32)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        // this.levelEndArea.setTrigger("player", "PLAYER_ENTERED_LEVEL_END", null);
        this.levelEndArea.color = Color.WHITE;
    }

    protected addKeys(pos: Vec2) {
        let key = this.add.animatedSprite("key", "primary");
        key.animation.play("IDLE");
        key.position.set(pos.x * 32 + 16, pos.y * 32 + 16);
        this.keys.push(key);
    }

    protected addDoor() {
        let door = this.add.sprite("door", "primary");
        door.position.set(this.doorPos.x, this.doorPos.y);
        this.door = door;
    }

    protected addEnemy(spriteKey: string, pos: Vec2, options: Record<string, any>) {
        //Creates skeleton archer
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.addPhysics(new AABB(new Vec2(0, 0), new Vec2(12, 6)));
        enemy.colliderOffset = new Vec2(0, 12);
        enemy.position.set(pos.x * 32 + 16, pos.y * 32 + 16);
        enemy.addAI(EnemyController, options)
        enemy.setGroup("enemy");
        enemy.setTrigger("playerAttack", "ENEMY_HIT", null);
        this.enemies.push(enemy);
    }

    protected addHealthPotion(pos: Vec2) {
        let healthpot = this.add.sprite("healthpot", "primary");
        healthpot.position.set(pos.x * 32 + 16, pos.y * 32 + 16);
        this.healthpots.push(healthpot);
    }

    protected checkForForcedDialogue(): boolean {
        if (this.isTalking) return true;
        for (let i = 0; i < this.forced.length; i++) {
            if (this.forced[i].contains(this.player.position.x, this.player.position.y)) {
                this.dialogue = new Dialogue(this.dialogueList[i], this, this.textBox, this.text, this.overlay, false);
                this.forced[i].size = new Vec2(0,0);
                this.dialogue.startDialogue()
                return true;
            }
        }
        return false;
    }

    protected addUI() {
        //UI CURRENTLY ZOOMED IN
        this.hpbar = this.add.sprite("healthbar", "UIForeground");
        this.xpbar = this.add.sprite("xpbar", "UIForeground");
        this.hpbarBorder = this.add.sprite("healthbarBorder", "UIBackground");
        this.xpbarBorder = this.add.sprite("xpbarBorder", "UIBackground");

        this.hpbar.position = new Vec2(50, 20);
        this.hpbarBorder.position = new Vec2(50, 20);
        this.xpbar.position = new Vec2(50, 26);
        this.xpbarBorder.position = new Vec2(50, 26);

        this.xpbar.scale = new Vec2(0.05, 1);
    }

    //SCENE POSITION, NOT TILE POSITION
    protected addDecor(spriteKey: string, pos: Vec2, scale: Vec2) {
        let decor = this.add.sprite(spriteKey, "primary");
        decor.position = pos.clone();
        decor.scale = scale;
    }

    freezeEverything() {
        this.player.freeze();
        this.enemies.forEach(enemy => {
            enemy.freeze();
        });
    }

    unfreezeEverything() {
        this.player.unfreeze();
        this.enemies.forEach(enemy => {
            enemy.unfreeze();
        });
    }

}