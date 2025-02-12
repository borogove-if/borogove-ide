import React from "react";
import { observer } from "mobx-react";

interface PlayAudioElementProps {
    src: string;
}

export const PlayAudioElement: React.FC<PlayAudioElementProps> = ({ src }) => (
    <audio controls>
        <source src={src} type="audio/mpeg" />
    </audio>
);

interface PlayAudioProps {
    contents: string; // as a data uri
}

/**
 * Show an image
 */
const PlayAudio: React.FC<PlayAudioProps> = observer(({ contents }) => {
    return <PlayAudioElement src={contents} />;
});

export default PlayAudio;
