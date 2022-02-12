/**
 * Window dimensions
 */
type WindowDimensions = { width: number; height: number };

export const breakpoints = {
    mobile: 768,
    tablet: 1023
};

export const getWindowDimensions = (): WindowDimensions => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
};

export const isMobileWidth = (): boolean => getWindowDimensions().width <= breakpoints.mobile;
