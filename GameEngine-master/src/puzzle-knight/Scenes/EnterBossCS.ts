import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import BossRoom1 from "./BossRoom1";
import Cutscene from "./Cutscene";

export default class EnterBossCS extends Cutscene {

    startTime: number;
    dialogueDelay: number = 300;
    started: boolean;

    loadScene() {
        this.load.image("splashart", "assets/sprites/MeetingDragonInCave.png");
    }

    unloadScene() {

    }

    startScene() {
        this.startTime = Date.now();
        this.started = false;
        this.nextScene = BossRoom1;

        this.sentences = [
            "DRAGON: Another visitor?",
            "DRAGON: You're the fifth one this yea-",
            "KNIGHT: Where is the princess?!",
            "DRAGON: There is no prin-",
            "KNIGHT: Looks like I'll have to search for her over your dead body..."
        ];
        this.initLayers();
        this.initViewport();
        let background = this.initBackground("splashart");
        background.position = new Vec2(150, 100);
        background.scale = new Vec2(1, 1);

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