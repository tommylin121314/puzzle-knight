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
    private background: Layer;
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
        this.load.audio("music", "assets/sounds/DungeonSoundtrack.wav");
        this.load.image("playButton", "assets/sprites/Play-1.png.png");
        this.load.image("aboutButton", "assets/sprites/About-2.png.png");
        this.load.image("levelsButton", "assets/sprites/Levels-3.png.png");
        this.load.image("helpButton", "assets/sprites/Help-4.png.png");
        this.load.image("background", "assets/sprites/MainMenuBackground.png")
        this.load.image("close", "assets/sprites/Close.png");
        this.load.image("textBackground", "assets/sprites/SignBackground.png");
        this.load.image("aboutText", "assets/sprites/puzzleKnightAbout.png");
        this.load.image("level1", "assets/sprites/introcutscene.png")
        this.load.image("level2", "assets/sprites/lushplains.png")
        this.load.image("level3", "assets/sprites/darkDungeon.png")
        this.load.image("level4", "assets/sprites/slipperyBiome.png")
        this.load.image("level5", "assets/sprites/frozenChasm.png")
        this.load.image("level6", "assets/sprites/densEntrance.png")
        this.load.image("level7", "assets/sprites/meetDragon.png")
        this.load.image("level8", "assets/sprites/dragonFight.png")
        this.load.image("level9", "assets/sprites/postBattle.png")
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
        this.background = this.addLayer("background");
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

        const background = this.add.sprite("background", "background");
        background.scale= new Vec2(15,15);
        background.alpha = 0.9;
        background.position = new Vec2(center.x, center.y);
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
        this.playButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x-150, center.y+75), text: "Play"});
        let playImage = this.add.sprite("playButton", "mainMenu");
        this.playButton.size.set(350, 110);
        this.playButton.borderWidth = 3;
        this.playButton.borderColor = Color.WHITE;
        this.playButton.backgroundColor = Color.BLACK;
        this.playButton.onClickEventId = "play";
        playImage.position = new Vec2(center.x-150, center.y+75);
        playImage.scale = new Vec2(8, 8);

        //about button
        this.aboutButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x-180, center.y+220), text: "About"});
        this.aboutButton.size.set(300, 80);
        let aboutImage = this.add.sprite("aboutButton", "mainMenu");
        this.aboutButton.borderWidth = 3;
        this.aboutButton.borderColor = Color.WHITE;
        this.aboutButton.backgroundColor = Color.BLACK;
        this.aboutButton.onClickEventId = "about";
        aboutImage.position = new Vec2(center.x-180, center.y+220);
        aboutImage.scale = new Vec2(8,8);

        //controls button
        this.controlsButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+185, center.y+75), text: "Controls"});
        this.controlsButton.size.set(220, 100);
        let controlImage = this.add.sprite("helpButton", "mainMenu");
        this.controlsButton.borderWidth = 3;
        this.controlsButton.borderColor = Color.WHITE;
        this.controlsButton.backgroundColor = Color.BLACK;
        this.controlsButton.onClickEventId = "controls";
        controlImage.position = new Vec2(center.x+185, center.y+75);
        controlImage.scale = new Vec2(8,8);

        //close popup button
        this.closeButton = <Button>this.add.uiElement(UIElementType.BUTTON, "aboutL", {position: new Vec2(center.x, center.y+300), text: "Close"});
        let closeImage = this.add.sprite("close", "aboutL");
        closeImage.position = new Vec2(center.x, center.y+300);
        closeImage.scale = new Vec2(3, 3);

        //////****** ABOUT *******/////// make this a sprite
        let aboutBackground = this.add.sprite("textBackground", "aboutL");
        aboutBackground.position = new Vec2(center.x, center.y);
        aboutBackground.scale = new Vec2(20,10);
        this.about = this.add.sprite("aboutText", "aboutL");
        this.about.position = new Vec2(center.x, center.y);

        //////****** CONTROLS *******///////
        this.control = this.add.sprite("controls", "mainMenu");
        this.control.position = new Vec2(center.x, center.y);
        this.control.alpha = 0;

        //////****** LEVEL SELECT *******///////
        this.levelSelect = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+185, center.y+220), text: "Level Select"});
        this.levelSelect.borderWidth = 3;
        this.levelSelect.size.set(300, 80);
        this.levelSelect.borderColor = Color.WHITE;
        this.levelSelect.backgroundColor = Color.BLACK;
        let levelImage = this.add.sprite("levelsButton", "mainMenu");
        levelImage.position = new Vec2(center.x + 185, center.y + 220);
        levelImage.scale = new Vec2(8,8);

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

        let levelsBackground = this.add.sprite("textBackground", "levels");
        levelsBackground.position = new Vec2(center.x, center.y);
        levelsBackground.scale = new Vec2(20,10);
        let levelsSign = this.add.sprite("levelsButton", "levels");
        levelsSign.position = new Vec2(center.x, center.y-150);
        levelsSign.scale = new Vec2(8,8);
        let l1 = this.add.sprite("level1", "levels");
        l1.position = this.level1.position;
        let l2 = this.add.sprite("level2", "levels");
        l2.position = this.level2.position;
        let l3 = this.add.sprite("level3", "levels");
        l3.position = this.level3.position;
        let l4 = this.add.sprite("level4", "levels");
        l4.position = this.level4.position;
        let l5 = this.add.sprite("level5", "levels");
        l5.position = this.level5.position;
        let l6 = this.add.sprite("level6", "levels");
        l6.position = this.level6.position;
        let l7 = this.add.sprite("level7", "levels");
        l7.position = this.level7.position;
        let l8 = this.add.sprite("level8", "levels");
        l8.position = this.level8.position;
        let l9 = this.add.sprite("level9", "levels");
        l9.position = this.level9.position;


        let controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 250), text:'CONTROLS'});
        let move = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y - 150), text:'move: W,A,S,D'});
        let attack = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y -75), text:'Mouse Click'});
        let pickup = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y), text:'Pick up: E'});
        let talk = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y + 75), text:'Talk/Interact: R'});
        let switchWeapon = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x - 200, center.y + 150), text:'Switch Weapon: Q'});
        let cheats = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y - 200), text:'CHEATS'});
        let keys = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y - 150), text:'Give player all keys on level: K'});
        let speed = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y - 75), text:'Toggle super speed: L'});
        let heal = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y), text:'Fully heals player: O'});
        let mm = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y+75), text:'Return to Main Menu: M'});
        let closeControls = <Button>this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y+300), text: "Close"});

        let closeImage2 = this.add.sprite("close", "controls");
        closeImage2.position = new Vec2(center.x, center.y+300);
        closeImage2.scale = new Vec2(3, 3);
        let closeImage3 = this.add.sprite("close", "levels");
        closeImage3.position = new Vec2(center.x, center.y+300);
        closeImage3.scale = new Vec2(3, 3);

        closeControls.onClick = () => {
            this.mainMenu.setHidden(false);
            this.levels.setHidden(true);
            this.controls.setHidden(true);
            this.aboutL.setHidden(true);
        }
    }

}

































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































