// This fixes build errors with Dendry

if (!window["process"]) {
    window["process"] = {
        browser: true,
        cwd: () => ".",
        nextTick: (func: Function) => setTimeout(func, 1)
    } as any;
}

export default null;
