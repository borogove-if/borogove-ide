export const appVariant: AppVariant = process.env.REACT_APP_VARIANT as AppVariant;
export const isIdeVariant = process.env.REACT_APP_VARIANT === "ide";
export const isSnippetsVariant = process.env.REACT_APP_VARIANT === "snippets";