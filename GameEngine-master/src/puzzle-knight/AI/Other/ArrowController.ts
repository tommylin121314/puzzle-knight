import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default class ArrowController implements AI {

    owner: Sprite;
    speed: number;
    direction: Vec2;

    initializeAI(owner: Sprite, options: Record<string, any>) {
        this.owner = owner;
        this.direction = options.direction;
        this.speed = options.speed;
    }

    activate(options: Record<string, any>) {    }

    handleEvent(event: GameEvent) {    }

    update(deltaT: number) {
        this.owner.move(this.direction.clone().scale(this.speed * deltaT));
    }

    destroy() {    }

}