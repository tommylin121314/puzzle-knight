import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import Idle from "./Idle";
import Patrol from "./Patrol";

export default class EnemyController extends StateMachineAI {
    owner: GameNode;
    skeleton: boolean = false;
    goblin: boolean = false;
    playerPos: Vec2;
    speed: number;
    originalPos: Vec2;

    initializeAI(owner: GameNode, options: Record<string, any>) {

        //Setting properties of enemy from parameter
        this.owner = owner;
        this.speed = options.speed;
        this.playerPos = options.playerPos;
        this.originalPos = options.originalPos;
        if(options.skeleton) {
            this.skeleton = true;
        }
        if(options.goblin) {
            this.goblin = true;
        }

        //Initialize the states
        let idle = new Idle(this.owner, this);
        this.addState('idle', idle);
        let patrol = new Patrol(this.owner, this);
        this.addState('patrol', patrol);

        //Starting state
        this.initialize('idle');

    }

    changeState(state: string) {
        super.changeState(state);
    }

    update(deltaT: number) {
        super.update(deltaT);
    }
}