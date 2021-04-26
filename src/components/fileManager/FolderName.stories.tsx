import React from "react";

import { storiesOf } from "@storybook/react";
import FolderName from "./FolderName";
import { MaterialsFileType } from "types/enum";

const file: MaterialsFile = {
    name: "story.inf",
    id: "source1",
    type: MaterialsFileType.code,
    parent: null
};

const fiveFiles = [ { ...file }, { ...file }, { ...file }, { ...file }, { ...file } ];

const openFolder: MaterialsFile = {
    children: fiveFiles,
    id: "folder1",
    name: "Folder 1",
    isOpen: true,
    type: MaterialsFileType.folder
};

const closedFolder: MaterialsFile = {
    ...openFolder,
    children: fiveFiles.concat( fiveFiles ).concat( fiveFiles ),
    isOpen: false
};

storiesOf( "FolderName", module )
    .add( "Open folder with 5 items", () => <FolderName file={openFolder} /> )
    .add( "Closed folder with 15 items", () => <FolderName file={closedFolder} /> );
