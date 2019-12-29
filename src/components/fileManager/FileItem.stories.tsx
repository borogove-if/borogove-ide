import React from "react";

import { storiesOf } from "@storybook/react";
import { FileItemElement } from "./FileItem";
import { Menu, MenuList } from "bloomer";
import { MaterialsFileType } from "../../types/enum";
import { action } from "@storybook/addon-actions";

const openFolder: MaterialsFile = {
    name: "Folder 1",
    id: "folder1",
    isOpen: true,
    type: MaterialsFileType.folder
};

const closedFolder: MaterialsFile = { ...openFolder, isOpen: false };

const file1: MaterialsFile = {
    name: "story.inf",
    id: "source1",
    type: MaterialsFileType.code,
    parent: null
};

storiesOf( "FileItem", module )
    .addDecorator( storyFn => <Menu className="filelisting"><MenuList>{storyFn()}</MenuList></Menu> )
    .add( "Normal source file", () => <FileItemElement file={file1} onClick={action( "File click" )} isEntryFile={false} isIncludePath={false} /> )
    .add( "Active source file", () => <FileItemElement file={file1} onClick={action( "File click" )} isEntryFile={false} isIncludePath={false} isActive /> )
    .add( "Entry file", () => <FileItemElement file={openFolder} onClick={action( "File click" )} isEntryFile={true} isIncludePath={false} /> )
    .add( "Include path", () => <FileItemElement file={openFolder} onClick={action( "File click" )} isEntryFile={false} isIncludePath={true} /> )
    .add( "Open folder", () => <FileItemElement file={openFolder} onClick={action( "File click" )} isEntryFile={false} isIncludePath={false} /> )
    .add( "Closed folder", () => <FileItemElement file={closedFolder} onClick={action( "File click" )} isEntryFile={false} isIncludePath={false} /> );
