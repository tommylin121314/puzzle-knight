import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import Idle from "./Idle";
import Patrol from "./Patrol";
import Chase from "./Chase";
import Attack from "./Attack";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Hurt from "./Hurt";
import Death from "./Death";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

export default class EnemyController extends StateMachineAI {
    owner: GameNode;
    skeleton: boolean = false;
    goblin: boolean = false;
    playerPos: Vec2;
    speed: number;
    originalPos: Vec2;
    arrow: Sprite;
    bow: AnimatedSprite;
    attackLayer: Layer;
    walls: OrthogonalTilemap;

    health: number = 50;

    initializeAI(owner: GameNode, options: Record<string, any>) {

        //Setting properties of enemy from parameter
        this.owner = owner;
        this.speed = options.speed;
        this.playerPos = options.playerPos;
        this.originalPos = options.originalPos;
        this.attackLayer = options.attackLayer;
        this.walls = options.walls;
        if(options.skeleton) {
            this.skeleton = true;
            this.bow = options.bow;
            this.bow.visible = false;
            this.arrow = options.arrow;
            this.arrow.visible = false;
        }
        if(options.goblin) {
            this.goblin = true;
        }

        //Initialize the states
        let idle = new Idle(this.owner, this);
        this.addState('idle', idle);
        let patrol = new Patrol(this.owner, this);
        this.addState('patrol', patrol);
        let chase = new Chase(this.owner, this);
        this.addState('chase', chase);
        let attack = new Attack(this.owner, this);
        this.addState('attack', attack);
        let hurt = new Hurt(this.owner, this);
        this.addState('hurt', hurt);
        let death = new Death(this.owner, this);
        this.addState('death', death);

        //Starting state
        this.initialize('idle');

    }

    changeState(state: string) {
        super.changeState(state);
    }

    update(deltaT: number) {
        super.update(deltaT);
    }

    damage(damage: number) {
        this.changeState("hurt");
        this.health -= damage;
    }
}