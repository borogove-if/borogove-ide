import React from "react";

import { storiesOf } from "@storybook/react";
import { FileListingElement } from "./FileListing";
import { MaterialsFileType } from "types/enum";
import { Menu } from "bloomer";

const folder1: MaterialsFile = {
    name: "Folder 1",
    id: "folder1",
    type: MaterialsFileType.folder,
    children: [
        {
            name: "File 1a1",
            id: "file1a1",
            type: MaterialsFileType.data
        },
        {
            name: "File 1a2",
            id: "file1a2",
            type: MaterialsFileType.data
        },
        {
            name: "Nested Folder 1b",
            id: "folder1b",
            type: MaterialsFileType.folder,
            children: [
                {
                    name: "File 1b1",
                    id: "file1b1",
                    type: MaterialsFileType.data
                },
                {
                    name: "File 1b2",
                    id: "file1b2",
                    type: MaterialsFileType.data
                }
            ]
        }
    ]
};

const folder2: MaterialsFile = {
    name: "Folder 2",
    id: "folder2",
    type: MaterialsFileType.folder,
    children: [
        {
            name: "File 2a1",
            id: "file2a1",
            type: MaterialsFileType.data
        },
        {
            name: "File 2a2",
            id: "file2a2",
            type: MaterialsFileType.data
        }
    ]
};

folder1.children && folder1.children.forEach( child => child.parent = folder1 );

const files: MaterialsFile[] = [
    {
        name: "story.inf",
        id: "source1",
        type: MaterialsFileType.code,
        parent: null
    },
    folder1,
    folder2
];

storiesOf( "FileListing", module )
    .addDecorator( storyFn => <Menu className="filelisting">{storyFn()}</Menu> )
    .add( "File listing", () => <FileListingElement files={files} selected="file2a1" /> )
    .add( "Read only mode", () => <FileListingElement files={files} selected="file2a1" readonly /> );