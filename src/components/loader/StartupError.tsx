import React from "react";
import { observer } from "mobx-react";
import { Button } from "bloomer";

import { isInFrame } from "services/app/env";

import "./FullScreen.scss";

interface StartupErrorElementProps {
    isInFrame?: boolean;
}

export const StartupErrorElement: React.FC<StartupErrorElementProps> = ({ isInFrame = false }) => <div className="full-screen has-text-danger is-size-5">
    <div className="startup-error">
        <p>
            Cannot initialize storage system.
        </p>
        {isInFrame && <>
            <p>
                Your browser's security settings may block features when running the app embedded in another web page.
                You can try opening the app in a separate window instead.
            </p>
            <div>
                <Button href={window.location.href} target="_blank">
                    Open in a new tab/window
                </Button>
            </div>
        </>}
    </div>
</div>;

/**
 * Shows an error message if the app can't start for some reason
 */
const StartupError: React.FC = observer( () => {
    return <StartupErrorElement isInFrame={isInFrame} />;
});

export default StartupError;
