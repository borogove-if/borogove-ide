import React from "react";
import { observer } from "mobx-react";
import { Title } from "bloomer";

import settingsStore from "stores/settingsStore";

import CheckboxControl from "../controls/CheckboxControl";

interface FileManagerOptionsElementProps {
    askBeforeOverwrite: boolean;
    onChange: (key: string, newValue: boolean) => void;
}

export const FileManagerOptionsElement: React.FC<
    FileManagerOptionsElementProps
> = ({ askBeforeOverwrite, onChange }) => {
    return (
        <section>
            <Title isSize={3}>File manager options</Title>

            <CheckboxControl
                label="Uploading duplicate files"
                description="Ask before overwriting duplicate files"
                checked={askBeforeOverwrite}
                onChange={(): void =>
                    onChange("askBeforeOverwrite", !askBeforeOverwrite)
                }
            />
        </section>
    );
};

/**
 * Options to opt-out of data collection
 */
const FileManagerOptions: React.FC = observer(() => {
    const getValue = (value: string): boolean =>
        settingsStore.getSetting("filesystem", value);
    const onChange = (option: string, newValue: boolean): void => {
        settingsStore.saveSetting("filesystem", option, newValue);
    };
    const askBeforeOverwrite = getValue("askBeforeOverwrite") as boolean;

    return (
        <FileManagerOptionsElement
            askBeforeOverwrite={askBeforeOverwrite}
            onChange={onChange}
        />
    );
});

export default FileManagerOptions;
