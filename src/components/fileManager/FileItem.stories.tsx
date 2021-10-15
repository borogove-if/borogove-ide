import React from "react";
import { storiesOf } from "@storybook/react";
import { Menu, MenuList } from "bloomer";
import { action } from "@storybook/addon-actions";

import { MaterialsFileType } from "stores/materialsStore";

import { FileItemElement } from "./FileItem";


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

const onSort = ( dir: 1 | -1 ): void => { action( "Sort " + dir ); };

storiesOf( "FileItem", module )
    .addDecorator( storyFn => <Menu className="filelisting"><MenuList>{storyFn()}</MenuList></Menu> )
    .add( "Normal source file", () => <FileItemElement file={file1} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={false} isLast={false} isSortable={false} /> )
    .add( "Active source file", () => <FileItemElement file={file1} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={false} isLast={false} isSortable={false} isActive /> )
    .add( "Entry file", () => <FileItemElement file={openFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={true} isIncludePath={false} isFirst={false} isLast={false} isSortable={false} /> )
    .add( "Include path", () => <FileItemElement file={openFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={true} isFirst={false} isLast={false} isSortable={false} /> )
    .add( "Open folder", () => <FileItemElement file={openFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={false} isLast={false} isSortable={false} /> )
    .add( "Closed folder", () => <FileItemElement file={closedFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={false} isLast={false} isSortable={false} /> )
    .add( "Sortable", () => <FileItemElement file={closedFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={false} isLast={false} isSortable={true} /> )
    .add( "Sortable first", () => <FileItemElement file={closedFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={true} isLast={false} isSortable={true} /> )
    .add( "Sortable last", () => <FileItemElement file={closedFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={false} isLast={true} isSortable={true} /> )
    .add( "Sortable first & last", () => <FileItemElement file={closedFolder} onClick={action( "File click" )} onSort={onSort} isEntryFile={false} isIncludePath={false} isFirst={true} isLast={true} isSortable={true} /> );

