import React from "react";
import { observer } from "mobx-react";
import { Title } from "bloomer";

import settingsStore from "stores/settingsStore";

import CheckboxControl from "../controls/CheckboxControl";
import DropdownControl from "../controls/DropdownControl";
import SliderControl from "../controls/SliderControl";

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 40;

/**
 * Editor options, shared between global and system settings
 */
const EditorOptions: React.FC = observer(() => {
    const onChange =
        (option: string): ((newValue: boolean | string | number) => void) =>
        (newValue: boolean | string | number): void => {
            settingsStore.saveSetting("editor", option, newValue);
        };

    const getValue = (value: string): boolean | string | number =>
        settingsStore.getSetting("editor", value);

    const fonts = [
        {
            value: "monospace",
            label: "Fixed width"
        },
        {
            value: "sans-serif",
            label: "Variable width"
        }
    ];

    return (
        <section>
            <Title isSize={3}>Editor options</Title>

            <SliderControl
                label="Font size"
                value={getValue("fontSize") as number}
                onChange={onChange("fontSize")}
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
            />

            <DropdownControl
                label="Typeface"
                options={fonts}
                value={getValue("fontFamily") as string}
                onChange={onChange("fontFamily")}
            />

            <CheckboxControl
                label="Line numbers"
                description="Show line numbers"
                checked={getValue("lineNumbers") as boolean}
                onChange={onChange("lineNumbers")}
            />

            <CheckboxControl
                label="Word wrapping"
                description="Divide long text into multiple lines"
                checked={getValue("wordWrap") as boolean}
                onChange={onChange("wordWrap")}
            />

            <CheckboxControl
                label="Wrapping indent"
                description="Indent wrapped lines"
                checked={getValue("wrappingIndent") as boolean}
                onChange={onChange("wrappingIndent")}
            />
        </section>
    );
});

export default EditorOptions;
