import Game from "./Wolfie2D/Loop/Game";
import default_scene from "./default_scene";
import MainMenu from "./puzzle-knight/Scenes/MainMenu";
import Dungeon1 from "./puzzle-knight/Scenes/TestDungeon";
import Test from "./demos/AudioDemo";
import TestDungeon from "./puzzle-knight/Scenes/TestDungeon";
import Level1 from "./puzzle-knight/Scenes/OldLevels/Level1";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 100, g: 100, b: 100},   // The color the game clears to
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

function runTests(){};