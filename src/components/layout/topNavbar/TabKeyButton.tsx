import React from "react";
import { Button } from "bloomer";
import { MdKeyboardTab } from "react-icons/md";
import { observer } from "mobx-react";

import editorStateStore from "stores/editorStateStore";
import ideStateStore from "stores/ideStateStore";
import { TabContentType } from "stores/tabStore";

interface TabKeyButtonElementProps {
    disabled?: boolean;
    onClick: () => void;
}

export const TabKeyButtonElement: React.FC<TabKeyButtonElementProps> = ({ disabled = false, onClick }) => <Button onClick={onClick} disabled={disabled} title="Insert tab character">
    <MdKeyboardTab className="no-margin-fix" />
</Button>;


/**
 * Button for mobile nav that inserts a tab character to the source code.
 */
const TabKeyButton: React.FC = observer( () => {
    const addTab = (): void => editorStateStore.insertTab();

    // Disable the button if the code editor isn't visible
    const activePane = ideStateStore.getActivePane();
    const disabled = !activePane || activePane.type !== TabContentType.editor;

    return <TabKeyButtonElement disabled={disabled} onClick={addTab} />;
});

export default TabKeyButton;
