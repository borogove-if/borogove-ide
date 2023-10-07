/**
 * These are the module declarations for packages that lack Typescript definitions.
 * Just declaring them stops Typescript from complaining about missing definitions.
 */

declare module "react-split";

// lets Typescript import text files (together with the raw-loader Webpack loader)
declare module "*.txt";

// istextorbinary doesn't play nicely with Webpack/VSCode
declare module "istextorbinary/edition-es2019/index";

//dendry module
declare module "dendry/lib/parsers/compiler";