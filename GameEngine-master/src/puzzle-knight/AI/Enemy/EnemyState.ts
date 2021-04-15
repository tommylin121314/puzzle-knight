import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";

export default abstract class EnemyState extends State {

    owner: GameNode;
    parent: EnemyController;
    
    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;
    }

    handleInput(event: GameEvent) {    }

    update(deltaT: number): void {
        if(this.owner._velocity.x > 0){
            (<AnimatedSprite>this.owner).invertX = true;
        }
        else if(this.owner._velocity.x < 0){
            (<AnimatedSprite>this.owner).invertX = false;
        }
    }

}