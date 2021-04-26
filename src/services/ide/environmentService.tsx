/**
 * React to window dimension changes.
 *
 * Adapted from https://stackoverflow.com/a/36862446
 */
import { useState, useEffect } from "react";

type WindowDimensions = { width: number; height: number };

function getWindowDimensions(): WindowDimensions {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export function useWindowDimensions(): WindowDimensions {
    const [ windowDimensions, setWindowDimensions ] = useState( getWindowDimensions() );

    useEffect( () => {
        function handleResize(): void {
            setWindowDimensions( getWindowDimensions() );
        }

        window.addEventListener( "resize", handleResize );

        return (): void => window.removeEventListener( "resize", handleResize );
    }, [] );

    return windowDimensions;
}

export const breakpoints = {
    mobile: 768,
    tablet: 1023
};
