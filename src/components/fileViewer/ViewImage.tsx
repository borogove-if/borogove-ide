import React from "react";
import { observer } from "mobx-react";

import "./ViewImage.scss";

interface ViewImageElementProps {
    src: string;
}

export const ViewImageElement: React.FC<ViewImageElementProps> = ({ src }) => <img src={src} alt="Image preview" />;

interface ViewImageProps {
    contents: string;   // as a data uri
}

/**
 * Show an image
 */
const ViewImage: React.FC<ViewImageProps> = observer( ({ contents }) => {
    return <ViewImageElement src={contents} />;
});

export default ViewImage;