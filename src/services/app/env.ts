export const appVariant: AppVariant = process.env.REACT_APP_VARIANT as AppVariant;
export const isIdeVariant = process.env.REACT_APP_VARIANT === "ide";
export const isSnippetsVariant = process.env.REACT_APP_VARIANT === "snippets";

// Checks if the app is being run inside an iframe
let isInFrame: boolean;

try {
    isInFrame = window.self !== window.top;
}
catch( e ) {
    // window.top throws an exception if the app is inside a cross-origin iframe
    isInFrame = true;
}

export { isInFrame };
