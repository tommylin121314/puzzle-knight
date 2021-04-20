import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import {TweenableProperties} from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene"
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import TestDungeon from "./TestDungeon";

export default class MainMenu extends Scene {
    private mainMenu: Layer;
    private about: Sprite;
    private popUpIsOpen: Boolean;
    private control: Sprite;
    private playButton: Button;
    private aboutButton: Button;
    private controlsButton: Button;
    private closeButton: Button;

    loadScene() {
        this.load.image("logo", "assets/sprites/puzzle-knight-logo.png");
        this.load.image("controls", "assets/sprites/controls.png");
        this.load.image("about", "assets/sprites/about.png");
    }

    startScene() {
        //gets center of viewport
        const center = this.viewport.getCenter();

        //no popups should be open
        this.popUpIsOpen = false;

        //////****** MAIN MENU *******///////
        this.mainMenu = this.addUILayer("mainMenu");

        //game logo
        const logo = this.add.sprite("logo", "mainMenu");
        logo.position = new Vec2(center.x, center.y-200);
        logo.scale = new Vec2(10,7);

        this.addUI();






    }

    updateScene() {
        this.playButton.onClick = () => {
            if (this.popUpIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(TestDungeon, {}, sceneOptions);
        }

        this.aboutButton.onClick = () => {
            if (this.popUpIsOpen) return;
            this.popUpIsOpen = true;
            const center = this.viewport.getCenter();
            this.about.alpha = 1;
            this.closeButton.borderColor = Color.WHITE;
            this.closeButton.backgroundColor = Color.BLACK;
            this.closeButton.textColor = Color.WHITE;
            this.closeButton.alpha = 1;
        }

        this.controlsButton.onClick = () => {
            if (this.popUpIsOpen) return;
            this.popUpIsOpen = true;
            const center = this.viewport.getCenter();
            this.control.alpha = 1;
            this.closeButton.borderColor = Color.WHITE;
            this.closeButton.backgroundColor = Color.BLACK;
            this.closeButton.textColor = Color.WHITE;
            this.closeButton.alpha = 1;
        }

        this.closeButton.onClick = () => {
            if (!this.popUpIsOpen) return;
            this.popUpIsOpen = false;
            this.control.alpha = 0;
            this.about.alpha = 0;
            this.closeButton.borderColor = new Color(0,0,0,0);
            this.closeButton.backgroundColor = new Color(0,0,0,0);
            this.closeButton.textColor = new Color(0,0,0,0);
            this.closeButton.alpha = 0;
        }
    }

    protected addUI() {

        const center = this.viewport.getCenter();
        //play button
        this.playButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y+75), text: "Play"});
        this.playButton.size.set(500, 110);
        this.playButton.borderWidth = 3;
        this.playButton.borderColor = Color.WHITE;
        this.playButton.backgroundColor = Color.BLACK;
        this.playButton.onClickEventId = "play";

        //about button
        this.aboutButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x-140, center.y+220), text: "About"});
        this.aboutButton.size.set(220, 100);
        this.aboutButton.borderWidth = 3;
        this.aboutButton.borderColor = Color.WHITE;
        this.aboutButton.backgroundColor = Color.BLACK;
        this.aboutButton.onClickEventId = "about";

        //controls button
        this.controlsButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+140, center.y+220), text: "Controls"});
        this.controlsButton.size.set(220, 100);
        this.controlsButton.borderWidth = 3;
        this.controlsButton.borderColor = Color.WHITE;
        this.controlsButton.backgroundColor = Color.BLACK;
        this.controlsButton.onClickEventId = "controls";

        //close popup button
        this.closeButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y+300), text: "Close"});
        this.closeButton.borderWidth = 3;
        this.closeButton.borderColor = new Color(0,0,0,0);
        this.closeButton.backgroundColor = new Color(0,0,0,0);
        this.closeButton.textColor = new Color(0,0,0,0);
        this.closeButton.alpha = 0;

        //////****** ABOUT *******/////// make this a sprite
        this.about = this.add.sprite("about", "mainMenu");
        this.about.position = new Vec2(center.x, center.y);
        this.about.alpha = 0;

        //////****** CONTROLS *******///////
        this.control = this.add.sprite("controls", "mainMenu");
        this.control.position = new Vec2(center.x, center.y);
        this.control.alpha = 0;

        // button clicks


    }

}

