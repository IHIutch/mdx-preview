declare module '*.css?url' {
    const url: string;
    export default url;
}

declare module '*.js?url' {
    const url: string;
    export default url;
}

declare module '*.scss?url' {
    const url: string;
    export default url;
}

declare module '*.worker?worker' {
    const Worker: new () => Worker;
    export default Worker;
}