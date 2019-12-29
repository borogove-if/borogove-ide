import React from "react";
import { observer } from "mobx-react";
import { Field, Label, Control, Checkbox } from "bloomer";

export const CheckboxControlElement: React.FC<CheckboxControlProps> = observer( ({ checked = false, description, label, onChange }) => <Field>
    <Label>
        {label}
    </Label>
    <Control>
        <Checkbox checked={checked} onChange={( e: React.FormEvent<HTMLInputElement> ): void => onChange( ( e.target as HTMLInputElement ).checked )}>
            {" "}{description}
        </Checkbox>
    </Control>
</Field> );

interface CheckboxControlProps {
    checked?: boolean;
    description: string;
    label: string;
    onChange: ( newValue: boolean ) => void;
}

/**
 * Setting that has a binary choice represented by a checkbox
 */
const CheckboxControl: React.FC<CheckboxControlProps> = observer( ( props ) => {
    return <CheckboxControlElement {...props} />;
});

export default CheckboxControl;