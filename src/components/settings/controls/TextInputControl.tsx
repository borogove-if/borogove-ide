import React from "react";
import { observer } from "mobx-react";
import { Field, Label, Control, Input } from "bloomer";

export const TextInputControlElement: React.FC<TextInputControlProps> = observer( ({ value = "", label, description = "" }) => <Field>
    <Label>
        {label}
    </Label>
    <Control>
        {description}
        <Input type="text" value={value} />
    </Control>
</Field> );

interface TextInputControlProps {
    value?: string;
    description?: string;
    label: string;
}

/**
 * Setting that have freeform text input
 */
const TextInputControl: React.FC<TextInputControlProps> = observer( ( props ) => {
    return <TextInputControlElement {...props} />;
});

export default TextInputControl;
