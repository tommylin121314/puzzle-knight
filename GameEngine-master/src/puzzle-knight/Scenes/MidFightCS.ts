import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import BossRoom1 from "./BossRoom1";
import Cutscene from "./Cutscene";
import MainMenu from "./MainMenu";

export default class MidFightCS extends Cutscene {

    startTime: number;
    dialogueDelay: number = 300;
    started: boolean;

    loadScene() {
        this.load.audio("soundtrack", "assets/sounds/BossSoundtrack.wav");
    }

    unloadScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: 'soundtrack'});

    }

    startScene() {
        this.startTime = Date.now();
        this.started = false;
        this.nextScene = MainMenu;

        this.sentences = [
            "KNIGHT: Why can't I hit him? How is he so strong...",
            "DRAGON: You can't hit me because I'm on a whole other",
            "DRAGON: dimension in terms of strength. Literally.",
            "KNIGHT: That doesn't make any sens-",
            "DRAGON: So are you willing to listen now..",
            "DRAGON: ..or should we keep going at it?",
            "The dragon tells the knight everything the king had planned...",
            "After hearing about the king's plot to kill him because he didn't approve",
            "Of the marriage, the knight stormed back to the kingdom and killed the king.",
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