import React from "react";
import { observer } from "mobx-react";
import { Field, Label, Control, Select } from "bloomer";

export const DropdownControlElement: React.FC<DropdownControlProps> = observer( ({ options, description, label, onChange, value }) => <Field>
    <Label>
        {label}
    </Label>
    <Control>
        {description}
        <Select onChange={( e: React.FormEvent<HTMLInputElement> ): void => onChange( ( e.target as HTMLInputElement ).value )}
                value={value}>
            {options.map( option => <option key={option.value} value={option.value}>{option.label}</option> )}
        </Select>
    </Control>
</Field> );

interface DropdownControlProps {
    description?: string;
    label: string;
    onChange: ( newValue: string ) => void;
    options: { value: string; label: string }[];
    value: string;
}

/**
 * Setting that has a binary choice represented by a checkbox
 */
const DropdownControl: React.FC<DropdownControlProps> = observer( ( props ) => {
    return <DropdownControlElement {...props} />;
});

export default DropdownControl;