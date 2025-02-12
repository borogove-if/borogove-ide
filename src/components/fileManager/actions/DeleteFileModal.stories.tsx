import React from "react";

import { storiesOf } from "@storybook/react";
import { DeleteFileModalElement } from "./DeleteFileModal";
import { action } from "@storybook/addon-actions";

storiesOf("DeleteFileModal", module)
    .add("Deleting file", () => (
        <DeleteFileModalElement
            isFolder={false}
            name="test.txt"
            onConfirm={action("Deletion confirmed")}
        />
    ))
    .add("Deleting folder", () => (
        <DeleteFileModalElement
            isFolder={true}
            name="TestFolder"
            onConfirm={action("Deletion confirmed")}
        />
    ));
