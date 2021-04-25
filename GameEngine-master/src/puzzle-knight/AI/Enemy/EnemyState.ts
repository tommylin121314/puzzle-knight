import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "./EnemyController";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default abstract class EnemyState extends State {

    owner: GameNode;
    parent: EnemyController;

    seesPlayer: boolean;

    constructor(owner: GameNode, parent: StateMachine) {
        super(parent);
        this.owner = owner;
        this.seesPlayer = false;
    }

    handleInput(event: GameEvent) {    }

    update(deltaT: number): void {
        if(this.owner._velocity.x > 0){
            (<AnimatedSprite>this.owner).invertX = true;
        }
        else if(this.owner._velocity.x < 0){
            (<AnimatedSprite>this.owner).invertX = false;
        }

        if(this.owner.position.clone().distanceTo(this.parent.playerPos) < 300)
            this.seesPlayer = this.lookForPlayer();

    }

    lookForPlayer() {
        let flag = true;
        let lineToPlayer = this.owner.position.clone().vecTo(this.parent.playerPos);
        let xNum = lineToPlayer.x / 16;
        let yNum = lineToPlayer.y / 16;
        let xIncr = 16 * Math.sign(lineToPlayer.x);
        let yIncr = 16 *  Math.sign(lineToPlayer.y);
        if(Math.abs(xNum) > Math.abs(yNum)) {
            yIncr = Math.abs((yNum / xNum)) * yIncr;
        }
        else if(Math.abs(yNum) > Math.abs(xNum)) {
            xIncr = Math.abs((xNum / yNum)) * xIncr;
        }
        let checkPos = this.owner.position.clone();
        let incVec = new Vec2(xIncr, yIncr);
        console.log("CHECKING FOR WALLS");
        for(let i = 0; i < (Math.max(Math.abs(xNum), Math.abs(yNum)) === Math.abs(xNum) ? Math.abs(xNum) : Math.abs(yNum)); i++) {
            checkPos.add(incVec);
            let checkBlock = this.parent.walls.getColRowAt(checkPos);
            let tile = this.parent.walls.getTileAtRowCol(checkBlock);
            console.log(tile);
            if(tile != 0) {
                flag = false;
                return false;
            }
        }
        return flag;
    }

}