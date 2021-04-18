import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import ProjectileController from "./ProjectileController";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default abstract class ProjectileState extends State {

    owner: GameNode;
    parent: ProjectileController;
    
    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;
    }

    handleInput(event: GameEvent) {    }

    update(deltaT: number): void {
        if(new AABB(this.parent.playerPos, new Vec2(16,16)).containsPoint(this.parent.hitPoint)) {
            this.owner.destroy();
            this.emitter.fireEvent("ARROW_HIT_PLAYER", {
                damage: this.parent.damage
            });
        }
    }

}