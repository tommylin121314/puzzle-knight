import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import ProjectileController from "./ProjectileController";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import EnemyController from "../Enemy/EnemyController";

export default abstract class ProjectileState extends State {

    owner: GameNode;
    parent: ProjectileController;
    hit: boolean = false;
    
    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;
    }

    handleInput(event: GameEvent) {    }

    update(deltaT: number): void {

        if(this.parent.enemy) {

            if(new AABB(this.parent.playerPos, new Vec2(8,13)).containsPoint(this.parent.hitPoint)) {
                this.owner.destroy();
                this.emitter.fireEvent("ARROW_HIT_PLAYER", {
                    damage: this.parent.damage
                });
            }

        }
        else {
            
            this.parent.enemies.forEach(enemy => {
                if(enemy.collisionShape !== null) {
                    if(enemy.collisionShape.containsPoint(this.parent.hitPoint)) {
                        if(!this.hit) {
                            this.owner.destroy();
                            this.emitter.fireEvent("ENEMY_HIT", {
                                damage: this.parent.damage,
                                target: enemy
                            });
                            this.hit = true;
                        }
                    }
                }
            });
        }
    }

}