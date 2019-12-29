import React from "react";
import { observer } from "mobx-react";
import { Title } from "bloomer";

import settingsStore from "stores/settingsStore";

import CheckboxControl from "../controls/CheckboxControl";


interface DataCollectionOptionsElementProps {
    analytics: boolean;
    errors: boolean;
    onChange: ( key: string, newValue: boolean ) => void;
}

export const DataCollectionOptionsElement: React.FC<DataCollectionOptionsElementProps> = ({ analytics, errors, onChange }) => {

    return <section>
        <Title isSize={3}>
            Data collection permissions
        </Title>

        <CheckboxControl label="Statistics"
                         description="Allow collecting anonymous usage statistics"
                         checked={analytics}
                         onChange={(): void => onChange( "analytics", !analytics )} />

        <CheckboxControl label="Error logging"
                         description="Automatically send reports on system errors"
                         checked={errors}
                         onChange={(): void => onChange( "errors", !errors )} />
    </section>;

};


/**
 * Options to opt-out of data collection
 */
const DataCollectionOptions: React.FC = observer( () => {
    const getValue = ( value: string ): boolean => settingsStore.getSetting( "logging", value );
    const onChange = ( option: string, newValue: boolean ): void => {
        settingsStore.saveSetting( "logging", option, newValue );
    };
    const analytics = getValue( "analytics" ) as boolean;
    const errors = getValue( "errors" ) as boolean;

    return <DataCollectionOptionsElement analytics={analytics} errors={errors} onChange={onChange} />;
});

export default DataCollectionOptions;