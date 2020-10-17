import React from "react";
import { observer } from "mobx-react";
import BounceLoader from "react-spinners/BounceLoader";
import { Title } from "bloomer";

import "./FullScreen.scss";

interface FullScreenLoaderProps {
    title?: string;
}

/**
 * A load spinner that fills its container.
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = observer( ({ title }) => {
    return <div className="full-screen">
        {title && <Title>{title}</Title>}
        <BounceLoader />
    </div>;
});

export default FullScreenLoader;