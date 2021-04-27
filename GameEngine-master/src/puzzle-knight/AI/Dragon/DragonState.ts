import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import DragonController from "./DragonController";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default abstract class DragonState extends State {

    owner: GameNode;
    parent: DragonController;

    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;
    }

    handleInput(event: GameEvent) {    }

    update(deltaT: number): void {

    }

}