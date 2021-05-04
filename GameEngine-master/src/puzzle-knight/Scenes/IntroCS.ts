import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import BossRoom1 from "./BossRoom1";
import Cutscene from "./Cutscene";
import grassLevel from "./grassLevel";

export default class IntroCS extends Cutscene {

    startTime: number;
    dialogueDelay: number = 300;
    started: boolean;

    loadScene() {

    }

    unloadScene() {

    }

    startScene() {
        this.startTime = Date.now();
        this.started = false;
        this.nextScene = grassLevel;

        this.sentences = [
            ".......",
            "After the knight defeated the Orc Lord and rescued the princess,",
            "the knight and the maiden promptly fell in love.",
            "Upon returning, knight asked King Annek",
            "for his daughter's hand in marriage.",
            "A peasant marrying my daughter?",
            "Shocked as he was, the king gave them his blessings...",
            "And they lived happily ever after...",
            "......."
        ];
        this.initLayers();
        this.initViewport();

    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        if(Date.now() - this.startTime > this.dialogueDelay) {
            if(!this.started) {
                this.initDialogue();
                this.started = true;
            }
        }

        if(this.dialogueOver) {
            if(Date.now() - this.endTime > this.dialogueDelay) {
                this.goToNextScene();
            }
        }
    }

}