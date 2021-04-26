import React from "react";
import { observer } from "mobx-react";
import { Field, Label, Control, TextArea } from "bloomer";

export const TextareaControlElement: React.FC<TextareaControlProps> = observer( ({ value = "", label, description = "", onChange }) => <Field>
    <Label>
        {label}
    </Label>
    <Control>
        {description}
        <TextArea value={value} onChange={onChange} />
    </Control>
</Field> );

interface TextareaControlProps {
    value?: string;
    description?: string;
    label: string;
    onChange: ( event: React.FormEvent<HTMLInputElement> ) => void;
}

/**
 * Setting that have freeform text input on multiple lines
 */
const TextareaControl: React.FC<TextareaControlProps> = observer( ( props ) => {
    return <TextareaControlElement {...props} />;
});

export default TextareaControl;
