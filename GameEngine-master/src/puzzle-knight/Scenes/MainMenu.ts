import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene"
import Color from "../../Wolfie2D/Utils/Color";

export default class MainMenu extends Scene {
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;

    loadScene() {
        this.load.image("logo", "assets/sprites/puzzle-knight-logo.png")
    }

    startScene() {
        //gets center of viewport
        const center = this.viewport.getCenter();

        //////****** MAIN MENU *******///////
        this.mainMenu = this.addUILayer("mainMenu");

        //game logo
        const logo = this.add.sprite("logo", "mainMenu");
        logo.position = new Vec2(center.x, center.y-200);
        logo.scale = new Vec2(10,7);

        //play button
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y+75), text: "Play"});
        play.size.set(500, 110);
        play.borderWidth = 3;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.BLACK;
        play.onClickEventId = "play";

        //about button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x-140, center.y+220), text: "About"});
        about.size.set(220, 100);
        about.borderWidth = 3;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.BLACK;
        about.onClickEventId = "about";

        //controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x+140, center.y+220), text: "Controls"});
        controls.size.set(220, 100);
        controls.borderWidth = 3;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.BLACK;
        controls.onClickEventId = "controls";

        //////****** ABOUT *******///////
        this.about = this.addUILayer("about");
        this.about.setHidden(true);




        //////****** CONTROLS *******///////
    }
}