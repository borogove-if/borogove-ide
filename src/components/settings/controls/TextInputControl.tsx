import React from "react";
import { observer } from "mobx-react";
import { Field, Label, Control, Input, Button, TextArea } from "bloomer";

export const TextInputControlElement: React.FC<TextInputControlProps> =
    observer(
        ({
            description = "",
            label,
            multiline = false,
            onChange,
            resetValue,
            value = ""
        }) => {
            const onReset = (): void => onChange(resetValue || "");
            const onValueChange = (
                e: React.FormEvent<HTMLInputElement>
            ): void => onChange((e.target as HTMLInputElement).value);

            return (
                <Field>
                    <Label>{label}</Label>
                    <Control>
                        {description}
                        <div className="is-flex">
                            {multiline && (
                                <TextArea
                                    value={value}
                                    onChange={onValueChange}
                                />
                            )}
                            {!multiline && (
                                <Input
                                    type="text"
                                    value={value}
                                    onChange={onValueChange}
                                />
                            )}
                            {typeof resetValue === "string" && (
                                <Button onClick={onReset} isColor="ghost">
                                    reset
                                </Button>
                            )}
                        </div>
                    </Control>
                </Field>
            );
        }
    );

interface TextInputControlProps {
    description?: string;
    label: string;
    multiline?: boolean;
    onChange: (newValue: string) => void;
    resetValue?: string;
    value?: string;
}

/**
 * Setting that have freeform text input
 */
const TextInputControl: React.FC<TextInputControlProps> = observer(props => {
    return <TextInputControlElement {...props} />;
});

export default TextInputControl;
