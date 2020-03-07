import React from "react";
import { observer } from "mobx-react";
import { Button } from "bloomer";
import { v4 as uuid } from "uuid";

import { MaterialsFileType } from "types/enum";

import materialsStore from "stores/materialsStore";
import editorStateStore from "stores/editorStateStore";

interface CreateUUIDFileActionElementProps {
    onClick: () => void;
}

export const CreateUUIDFileActionElement: React.FC<CreateUUIDFileActionElementProps> = ({ onClick }) => <div className="has-text-centered">
    <Button onClick={onClick}>
        Generate new UUID
    </Button>
</div>;

/**
 * Button that lets the user create a new uuid.txt file
 */
const CreateUUIDFileAction: React.FC = observer( () => {
    const createUUIDFile = (): void => {
        const oldFile = materialsStore.findByFullPath( "/uuid.txt" );
        const newUUID = uuid();

        if( oldFile ) {
            oldFile.type = MaterialsFileType.text;
            oldFile.isBinary = false;
            materialsStore.updateFile( oldFile, newUUID );

            // refresh the editor view in case the uuid.txt file was open
            editorStateStore.refreshView();
        }
        else {
            materialsStore.addMaterialsFile(
                newUUID,
                {
                    isBinary: false,
                    locked: true,
                    name: "uuid.txt",
                    type: MaterialsFileType.text
                }
            );
        }
    };

    return <CreateUUIDFileActionElement onClick={createUUIDFile} />;
});

export default CreateUUIDFileAction;