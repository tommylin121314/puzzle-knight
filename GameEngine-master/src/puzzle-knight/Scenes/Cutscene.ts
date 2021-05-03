import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Dialogue from "../GameSystem/Dialogue";

export default class Cutscene extends Scene {

    protected dialogue: Dialogue;
    protected sentences: Array<string>;
    protected textBox: Rect;
    protected text: Label;
    protected imageKeys: Array<string>;
    protected background: Sprite;
    protected currSlide: number;
    
    protected dialogueOver: boolean = false;
    protected endTime: number;

    protected nextScene: new (...args: any) => Scene;

    loadScene() {

    }

    startScene() {

    }

    updateScene(deltaT: number) {
        if(!this.dialogueOver) {
            if(Input.isKeyJustPressed("r")) {
                let next = this.dialogue.getNextLine();
                if(!next) {
                    this.dialogueOver = true;
                    this.endTime = Date.now();
                }
            }
        }
    }

    initLayers() {
        this.addUILayer("UI");
    }

    initViewport() {
        this.viewport.setCenter(new Vec2(300, 200));
        this.viewport.setHalfSize(new Vec2(300, 200));
    }

    initDialogue() {
        this.textBox = <Rect>this.add.graphic(GraphicType.RECT, "UI", {
            position: new Vec2(300, 325),
            size: new Vec2(500, 75)
        });
        this.textBox.color = new Color(255,239,213,1);
        this.textBox.borderWidth = 10;
        this.textBox.borderColor = new Color(202,164,114,1);
        this.textBox.visible = false;

        this.text = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {
            position: new Vec2(300, 325),
            size: new Vec2(450, 60),
            text: ''
        });
        this.text.visible = false;

        this.dialogue = new Dialogue(this.sentences, null, this.textBox, this.text, null, true);
        this.dialogue.startDialogue();
    }

    initBackground(key: string) {
        let background = this.add.sprite(key, "UI");
        background.position = this.viewport.getCenter();
        return background;
    }

    goToNextScene() {
        this.sceneManager.changeToScene(this.nextScene, {}, {});
    }

}