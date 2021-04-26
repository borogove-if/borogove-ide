import React from "react";
import { observer } from "mobx-react";
import { Control, Field, Input, Label, Column, Columns } from "bloomer";

export const SliderControlElement: React.FC<SliderControlProps> = ({ description = "", label, max, min, onChange, step = 1, value }) => {
    const onValueChange = ( e: React.FormEvent<HTMLInputElement> ): void => onChange( Math.max( min, Math.min( max, Number( ( e.target as HTMLInputElement ).value ) ) ) );

    return <Field>
        <Label>
            {label}
        </Label>
        <Control>
            {description}

            <Columns isVCentered>
                <Column style={{ flexGrow: 0 }}>
                    <div style={{ width: "2rem", textAlign: "center" }}>
                        {value}
                    </div>
                </Column>
                <Column>
                    <Input type="range"
                           value={value}
                           min={min}
                           max={max}
                           step={step}
                           onChange={onValueChange} />
                </Column>
            </Columns>
        </Control>
    </Field>;
};

interface SliderControlProps {
    description?: string;
    label: string;
    max: number;
    min: number;
    onChange: ( value: number ) => void;
    step?: number;
    value: number;
}

/**
 * Setting that have freeform text input on multiple lines
 */
const SliderControl: React.FC<SliderControlProps> = observer( ( props ) => {
    return <SliderControlElement {...props} />;
});

export default SliderControl;
