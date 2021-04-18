import State from "../../../Wolfie2D/DataTypes/State/State"
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import ProjectileState from "./ProjectileState";

export default class Flying extends ProjectileState {

    onEnter() {

    }

    onExit() {
        return {};
    }

    update(deltaT: number) {
        super.update(deltaT);
        this.owner.move(this.parent.direction.clone().scale(this.parent.speed * deltaT));
        if(Date.now() - this.parent.startTime > this.parent.lifespan) {
            this.owner.destroy();
        }
    }

    handleInput(event: GameEvent) {

    }
}