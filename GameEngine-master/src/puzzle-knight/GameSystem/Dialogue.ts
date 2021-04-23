import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Game from "../../Wolfie2D/Loop/Game";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameLevel from "../Scenes/GameLevel";

export default class Dialogue {

    dialogue: Array<string>;
    currentSentence: number;

    textBox: Rect;
    text: Label;

    isStarted: boolean;

    scene: GameLevel;

    constructor(dialogue: Array<string>, scene: GameLevel, textBox: Rect, text: Label) {
        this.dialogue = dialogue;

        this.currentSentence = -1;
        this.isStarted = false;

        this.scene = scene;
        this.text = text;
        this.textBox = textBox;

    }

    startDialogue() {
        this.getNextLine();
        this.textBox.visible = true;
        this.text.visible = true;
        this.isStarted = true;
        this.scene.isTalking = true;
        this.scene.freezeEverything();
    }

    getNextLine() {
        if(this.currentSentence + 1 >= this.dialogue.length) {
            this.endDialogue();
            return;
        }

        this.currentSentence++;
        this.text.setText(this.dialogue[this.currentSentence]);

    }

    endDialogue() {
        this.textBox.visible = false;
        this.text.visible = false;
        this.currentSentence = -1;
        this.scene.unfreezeEverything();
        this.scene.isTalking = false;
    }

}