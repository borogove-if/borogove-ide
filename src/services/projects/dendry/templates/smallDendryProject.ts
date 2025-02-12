import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const info = `title: My first story
author: Your name
`;

const rootScene = `title: Root Scene
new-page: true

This is the root scene of "Dendry-starter-pack". The root scene is normally used
as a hub: the choices allow you to go to different sections of your
story. In shorter works it may just function as the first scene in the
game, sending the player off into the tree of choices. If the root
scene doesn't have any choices that it can display, the game is over.

# Scenes with a top tag can be displayed here.
- #top
`;

const oneScene = `title: Scene One
new-page: true
tags: top

This is the first scene of "Dendry-starter-pack". From this point, you can add
further scenes and choices to flesh out your game.
`;

class SmallDendryProjectTemplate extends ProjectTemplate {
    id = "smallExampleDendry";
    name = "Small example";
    isSnippetTemplate = false;
    files = [
        {
            contents: rootScene,
            id: "root",
            name: "scenes/root.scene.dry",
            type: MaterialsFileType.code
        },
        {
            contents: oneScene,
            id: "one",
            name: "scenes/one.scene.dry",
            type: MaterialsFileType.code
        },
        {
            contents: info,
            id: "info",
            name: "info.dry",
            type: MaterialsFileType.code
        }
    ];
}

export default new SmallDendryProjectTemplate();
