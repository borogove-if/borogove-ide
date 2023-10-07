// This fixes build errors with Dendry

if( !window["process"] ) {
    window["process"] = {
        browser: true,
        cwd: () => ".",
        // eslint-disable-next-line @typescript-eslint/ban-types
        nextTick: ( func: Function ) => setTimeout( func, 1 )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
}

export default null;
