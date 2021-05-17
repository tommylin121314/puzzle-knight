import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
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
import DragonEntrance from "./DragonEntrance";
import EnterBossCS from "./EnterBossCS";
import grassLevel from "./grassLevel";
import Ice1 from "./Ice1";
import Ice2 from "./Ice2";
import IntroCS from "./IntroCS";
import MidFightCS from "./MidFightCS";
import purpleDungeonLevel from "./purpleDungeonLevel";

import TestDungeon from "./TestDungeon";

export default class MainMenu extends Scene {
    private mainMenu: Layer;
    private levels: Layer;
    private controls: Layer;
    private aboutL: Layer;
    private about: Sprite;
    private popUpIsOpen: Boolean;
    private levelSelectIsOpen: Boolean;
    private control: Sprite;
    private playButton: Button;
    private aboutButton: Button;
    private controlsButton: Button;
    private closeButton: Button;
    private levelSelect: Button;
    private levelSelectHeader: Label;
    private level1: Button;
    private level2: Button;
    private level3: Button;
    private level4: Button;
    private level5: Button;
    private level6: Button;
    private level7: Button;
    private level8: Button;
    private level9: Button;
    private levelButtons: Array<Button>;

    loadScene() {
        this.load.image("logo", "assets/sprites/puzzle-knight-logo.png");
        this.load.image("controls", "assets/sprites/controls.png");
        this.load.image("about", "assets/sprites/about.png");
        this.load.audio("music", "assets/sounds/DungeonSoundtrack.wav")
        
        
    }
    unloadScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: 'music'});

    }

    startScene() {
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key:"music", loop:true});
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
        this.levels = this.addUILayer("levels");
        this.controls = this.addUILayer("controls");
        this.aboutL = this.addUILayer("aboutL");

        this.mainMenu.setHidden(false);
        this.levels.setHidden(true);
        this.controls.setHidden(true);
        this.aboutL.setHidden(true);

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
            this.sceneManager.changeToScene(IntroCS, {}, sceneOptions);
        }

        this.aboutButton.onClick = () => {
            this.mainMenu.setHidden(true);
            this.levels.setHidden(true);
            this.controls.setHidden(true);
            this.aboutL.setHidden(false);
        }

        this.controlsButton.onClick = () => {
            this.mainMenu.setHidden(true);
            this.levels.setHidden(true);
            this.controls.setHidden(false);
            this.aboutL.setHidden(true);
        }

        this.levelSelect.onClick = () => {
            /*
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
            */
            this.mainMenu.setHidden(true);
            this.levels.setHidden(false);
            this.controls.setHidden(true);
            this.aboutL.setHidden(true);
        }

        
        this.level1.onClick = () => {
            /*
            if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}*/
            this.sceneManager.changeToScene(IntroCS, {}, {});
        }

        this.level2.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(grassLevel, {}, sceneOptions);
        }

        this.level3.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(purpleDungeonLevel, {}, sceneOptions);
        }

        this.level4.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Ice1, {}, sceneOptions);
        }

        this.level5.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(Ice2, {}, sceneOptions);
        }

        this.level6.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(DragonEntrance, {}, sceneOptions);
        }

        this.level7.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(EnterBossCS, {}, sceneOptions);
        }

        this.level8.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(BossRoom1, {}, sceneOptions);
        }

        this.level9.onClick = () => {
            //if (!this.levelSelectIsOpen) return;
            let sceneOptions = {}
            this.sceneManager.changeToScene(MidFightCS, {}, sceneOptions);
        }


        this.closeButton.onClick = () => {
            /*
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
            */
            this.mainMenu.setHidden(false);
            this.levels.setHidden(true);
            this.controls.setHidden(true);
            this.aboutL.setHidden(true);
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
        this.closeButton = <Button>this.add.uiElement(UIElementType.BUTTON, "aboutL", {position: new Vec2(center.x, center.y+300), text: "Close"});

        //////****** ABOUT *******/////// make this a sprite
        this.about = this.add.sprite("about", "aboutL");
        this.about.position = new Vec2(center.x, center.y);

        //////****** CONTROLS *******///////
        this.control = this.add.sprite("controls", "mainMenu");
        this.control.position = new Vec2(center.x, center.y);
        this.control.alpha = 0;

        //////****** LEVEL SELECT *******///////
        this.levelSelect = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y+350), text: "Level Select"});
        this.levelSelect.borderWidth = 3;
        this.levelSelect.borderColor = Color.WHITE;
        this.levelSelect.backgroundColor = Color.BLACK;

        this.levelSelectHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levels", {position: new Vec2(center.x, center.y - 150), text:'LEVELS'});
        this.level1 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x-350, center.y), text: "I.Intro Cutscene"});
        this.level2 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x-350, center.y+75), text: "II.Lush Plains"});
        this.level3 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x-350, center.y+150), text: "III.Dark Dungeon"});
        this.level4 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y), text: "IV.Frozen Biome"});
        this.level5 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y+75), text: "V.Frozen Biome II"});
        this.level6 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y+150), text: "VI.Den's Entrance"});
        this.level7 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x+350, center.y), text: "VII.Enter Den Cutscene"});
        this.level8 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x+350, center.y+75), text: "VIII.Dragon Battle"});
        this.level9 = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x+350, center.y+150), text: "X.After Fight"});
        let close = <Button>this.add.uiElement(UIElementType.BUTTON, "levels", {position: new Vec2(center.x, center.y+300), text: "Close"});
        close.onClick =() => {
            this.mainMenu.setHidden(false);
            this.levels.setHidden(true);
            this.controls.setHidden(true);
            this.aboutL.setHidden(true);
        }

        let controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 250), text:'CONTROLS'});
        let move = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y - 150), text:'move: W,A,S,D'});
        let attack = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y -75), text:'Mouse Click'});
        let pickup = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y), text:'Pick up: E'});
        let talk = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y + 75), text:'Talk/Interact: R'});
        let switchWeapon = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y + 150), text:'Switch Weapon: Q'});
        let cheats = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y - 200), text:'CHEATS'});
        let keys = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y - 150), text:'Give player all keys on level'});
        let speed = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y - 75), text:'Toggle super speed'});
        let heal = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y), text:'Fully heals player'});
        let mm = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y+75), text:'Return to Main Menu'});
        let closeControls = <Button>this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y+300), text: "Close"});

        closeControls.onClick = () => {
            this.mainMenu.setHidden(false);
            this.levels.setHidden(true);
            this.controls.setHidden(true);
            this.aboutL.setHidden(true);
        }
    }

}

































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































