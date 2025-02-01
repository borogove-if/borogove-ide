import { makeAutoObservable, runInAction } from "mobx";

class RouteStore {
    public file: string | null = null;
    public project: string | null = null;

    private get fullPath(): string {
        if( !this.project ) {
            return "/";
        }

        if( !this.file ) {
            return `/${encodeURIComponent( this.project ) || ""}`;
        }

        return `/${encodeURIComponent( this.project )}/${encodeURIComponent( this.file )}`;
    }

    private onPopState = (): void => {
        runInAction( () => {
            this.parseUrl();
        });
    };

    private parseUrl(): void{
        const parts = window.location.pathname.split( "/" );
        this.project = parts[1] || null;
        this.file = parts.slice( 2 ).join( "/" ) || null;
    }

    public setProject( project: string ): void {
        if( project?.toLowerCase() === this.project?.toLowerCase() ) {
            return;
        }

        this.project = project;
        this.file = null;
    }

    public setFile( file: string ): void {
        // a bit of a hack, but avoid displaying the Inform 7 main file in the URL
        const filename = file === "story.ni" ? null : file;

        if( filename === this.file ) {
            if( window.location.pathname === "/" && this.project ) {
                window.history.pushState({}, "", this.fullPath );
            }

            return;
        }

        this.file = filename || null;
        window.history.pushState({}, "", this.fullPath );
    }

    constructor() {
        makeAutoObservable( this );
        window.addEventListener( "popstate", this.onPopState );
        this.parseUrl();
    }
}

export default new RouteStore();
