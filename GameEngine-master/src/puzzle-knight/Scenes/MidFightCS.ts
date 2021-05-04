import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import BossRoom1 from "./BossRoom1";
import Cutscene from "./Cutscene";

export default class MidFightCS extends Cutscene {

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
        this.nextScene = BossRoom1;

        this.sentences = [
            "KNIGHT: Why can't I hit him? How is he so strong...",
            "DRAGON: You can't hit me because I'm on a whole other",
            "DRAGON: dimension in terms of strength. Literally.",
            "KNIGHT: That doesn't make any sens-",
            "DRAGON: So are you willing to listen now..",
            "DRAGON: ..or should we keep going at it?"
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