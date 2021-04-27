import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode, {TweenableProperties} from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene"
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import BossRoom1 from "./BossRoom1";
import EnterBossCS from "./EnterBossCS";
import Ice1 from "./Ice1";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";

import TestDungeon from "./TestDungeon";

export default class MainMenu extends Scene {
    private mainMenu: Layer;
    private about: Sprite;
    private popUpIsOpen: Boolean;
    private levelSelectIsOpen: Boolean;
    private control: Sprite;
    private playButton: Button;
    private aboutButton: Button;
    private controlsButton: Button;
    private closeButton: Button;
    private levelSelect: Button;
    private level1: Button;
    private level2: Button;
    private level3: Button;
    private level4: Button;
    private level5: Button;
    private level6: Button;

    loadScene() {
        this.load.image("logo", "assets/sprites/puzzle-knight-logo.png");
        this.load.image("controls", "assets/sprites/controls.png");
        this.load.image("about", "assets/sprites/about.png");
    }

    startScene() {
        //gets center of viewport
        this.viewport.setCenter(600,400);
        const center = this.viewport.getCenter().clone();
        this.viewport.setZoomLevel(1);
        console.log("MAIN MENU: " + this.viewport.getCenter());

        //no popups should be open
        this.popUpIsOpen = false;
        this.levelSelectIsOpen = false;

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
            this.sceneManager.changeToScene(Ice1, {}, sceneOptions);
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

        this.levelSelect.onClick = () => {
            if (this.levelSelectIsOpen) return;
            // make level select buttons visible
            this.level1.borderColor = Color.WHITE;
            this.level1.backgroundColor = Color.BLACK;
            this.level1.textColor = Color.WHITE;
            this.level2.borderColor = Color.WHITE;
            this.level2.backgroundColor = Color.BLACK;
            this.level2.textColor = Color.WHITE;
            this.level3.borderColor = Color.WHITE;
            this.level3.backgroundColor = Color.BLACK;
            this.level3.textColor = Color.WHITE;
            this.level4.borderColor = Color.WHITE;
            this.level4.backgroundColor = Color.BLACK;
            this.level4.textColor = Color.WHITE;
            this.level5.borderColor = Color.WHITE;
            this.level5.backgroundColor = Color.BLACK;
            this.level5.textColor = Color.WHITE;
            this.level6.borderColor = Color.WHITE;
            this.level6.backgroundColor = Color.BLACK;
            this.level6.textColor = Color.WHITE;
            this.closeButton.borderColor = Color.WHITE;
            this.closeButton.backgroundColor = Color.BLACK;
            this.closeButton.textColor = Color.WHITE;
            this.levelSelectIsOpen = true;
        }

        this.level1.onClick = () => {
            if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Level1, {}, sceneOptions);
        }

        this.level2.onClick = () => {
            if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Level2, {}, sceneOptions);
        }

        this.level3.onClick = () => {
            if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Level3, {}, sceneOptions);
        }

        this.level4.onClick = () => {
            if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Level4, {}, sceneOptions);
        }

        this.level5.onClick = () => {
            if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Level5, {}, sceneOptions);
        }

        this.level6.onClick = () => {
            if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Level6, {}, sceneOptions);
        }

        this.closeButton.onClick = () => {
            if (!(this.popUpIsOpen || this.levelSelectIsOpen)) return;
            this.popUpIsOpen = false;
            this.levelSelectIsOpen = false;
            // get rid of popups
            this.control.alpha = 0;
            this.about.alpha = 0;
            this.level1.borderColor = new Color(0,0,0,0);
            this.level1.backgroundColor = new Color(0,0,0,0);
            this.level1.textColor = new Color(0,0,0,0);
            this.level2.borderColor = new Color(0,0,0,0);
            this.level2.backgroundColor = new Color(0,0,0,0);
            this.level2.textColor = new Color(0,0,0,0);
            this.level3.borderColor = new Color(0,0,0,0);
            this.level3.backgroundColor = new Color(0,0,0,0);
            this.level3.textColor = new Color(0,0,0,0);
            this.level4.borderColor = new Color(0,0,0,0);
            this.level4.backgroundColor = new Color(0,0,0,0);
            this.level4.textColor = new Color(0,0,0,0);
            this.level5.borderColor = new Color(0,0,0,0);
            this.level5.backgroundColor = new Color(0,0,0,0);
            this.level5.textColor = new Color(0,0,0,0);
            this.level6.borderColor = new Color(0,0,0,0);
            this.level6.backgroundColor = new Color(0,0,0,0);
            this.level6.textColor = new Color(0,0,0,0);
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

        //////****** LEVEL SELECT *******///////
        this.levelSelect = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y+350), text: "Level Select"});
        this.levelSelect.borderWidth = 3;
        this.levelSelect.borderColor = Color.WHITE;
        this.levelSelect.backgroundColor = Color.BLACK;

        this.level1 = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+350, center.y-350), text: "Level 1"});
        this.level1.borderWidth = 3;
        this.level1.borderColor = new Color(0,0,0,0);
        this.level1.backgroundColor = new Color(0,0,0,0);
        this.level1.textColor = new Color(0,0,0,0);

        this.level2 = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+350, center.y-300), text: "Level 2"});
        this.level2.borderWidth = 3;
        this.level2.borderColor = new Color(0,0,0,0);
        this.level2.backgroundColor = new Color(0,0,0,0);
        this.level2.textColor = new Color(0,0,0,0);

        this.level3 = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+350, center.y-250), text: "Level 3"});
        this.level3.borderWidth = 3;
        this.level3.borderColor = new Color(0,0,0,0);
        this.level3.backgroundColor = new Color(0,0,0,0);
        this.level3.textColor = new Color(0,0,0,0);

        this.level4 = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+350, center.y-200), text: "Level 4"});
        this.level4.borderWidth = 3;
        this.level4.borderColor = new Color(0,0,0,0);
        this.level4.backgroundColor = new Color(0,0,0,0);
        this.level4.textColor = new Color(0,0,0,0);

        this.level5 = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+350, center.y-150), text: "Level 5"});
        this.level5.borderWidth = 3;
        this.level5.borderColor = new Color(0,0,0,0);
        this.level5.backgroundColor = new Color(0,0,0,0);
        this.level5.textColor = new Color(0,0,0,0);

        this.level6 = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+350, center.y-100), text: "Level 6"});
        this.level6.borderWidth = 3;
        this.level6.borderColor = new Color(0,0,0,0);
        this.level6.backgroundColor = new Color(0,0,0,0);
        this.level6.textColor = new Color(0,0,0,0);


    }

}

































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































