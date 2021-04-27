import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Layer from "../../../Wolfie2D/Scene/Layer";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Dragon_Idle from "./Dragon_Idle";
import Dragon_LeftAttack from "./Dragon_LeftAttack";
import Dragon_RightAttack from "./Dragon_RightAttack";
import Dragon_RoarAttack from "./Dragon_RoarAttack";

export default class EnemyController extends StateMachineAI {

    owner: GameNode;
    playerPos: Vec2;
    attackLayer: Layer;

    initializeAI(owner: GameNode, options: Record<string, any>) {

        //Setting properties of enemy from parameter
        this.owner = owner;
        this.playerPos = options.playerPos;
        this.attackLayer = options.attackLayer;

        //Initialize the states
        let idle = new Dragon_Idle(this.owner, this);
        this.addState('idle', idle);
        let rightAttack = new Dragon_RightAttack(this.owner, this);
        this.addState('rightAttack', rightAttack);
        let leftAttack = new Dragon_LeftAttack(this.owner, this);
        this.addState('leftAttack', leftAttack);
        let roarAttack = new Dragon_RoarAttack(this.owner, this);
        this.addState("roarAttack", roarAttack);

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

    }
}