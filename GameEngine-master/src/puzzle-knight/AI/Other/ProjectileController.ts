import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Rect from "../../../Wolfie2D/Nodes/Graphics/Rect";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import ProjectileState from "./ProjectileState";
import Flying from "./Flying";

export default class ProjectileController extends StateMachineAI {

    owner: Sprite;
    speed: number;
    playerPos: Vec2;
    direction: Vec2;
    damage: number;

    lifespan: number;
    startTime: number;

    hitPoint: Vec2;

    enemy: boolean;

    initializeAI(owner: Sprite, options: Record<string, any>) {
        this.owner = owner;
        this.direction = options.direction;
        this.speed = options.speed;
        this.lifespan = options.lifespan;
        this.startTime = Date.now();
        this.enemy = options.enemy;
        if(this.enemy)
            this.playerPos = options.playerPos;

        this.damage = options.damage;

        this.hitPoint = this.owner.position;

        let flying = new Flying(this.owner, this);
        this.addState("flying", flying);

        this.initialize("flying");
    }

    /*update(deltaT: number) {
        this.owner.move(this.direction.clone().scale(this.speed * deltaT));
        if(Date.now() - this.startTime > this.lifespan) {
            this.owner.destroy();
        }
    }*/

    changeState(state: string) {
        super.changeState(state);
    }

    update(deltaT: number) {
        super.update(deltaT);
    }

}