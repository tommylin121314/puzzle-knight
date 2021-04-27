import Cutscene from "./Cutscene";

export default class EnterBossCS extends Cutscene {

    loadScene() {

    }

    unloadScene() {

    }

    startScene() {
        this.imageKeys = [];
        this.images = [];
        this.sentences = ["Welcome...", "I am a dragon", "Yes I am a dragon!"];
        this.initLayers();
        this.initViewport();
        this.initDialogue();
        this.initSlides();
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }

}