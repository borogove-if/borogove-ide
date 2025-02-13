import { makeAutoObservable, runInAction } from "mobx";

import type ProjectTemplate from "services/projects/ProjectTemplate.class";

/**
 * The route store manages navigation between projects and files by setting and reading them from the URL
 */
class RouteStore {
    public file: string | null = null;
    public project: string | null = null;
    public template: ProjectTemplate | null = null;

    private get fullPath(): string {
        if (!this.project) {
            return "/";
        }

        if (!this.file) {
            return `/${encodeURIComponent(this.project) || ""}`;
        }

        // make sure we don't encode the slashes that separate folders
        const encodedFile = this.file
            .split("/")
            .map(encodeURIComponent)
            .join("/");

        return `/${encodeURIComponent(this.project)}/${encodedFile}`;
    }

    /**
     * When the user navigates back and forward, re-set the file and project from the URL
     */
    private onPopState = (): void => {
        runInAction(() => {
            this.parseUrl();
        });
    };

    /**
     * Parse the URL for the project and file
     */
    private parseUrl(): void {
        const parts = window.location.pathname.split("/");
        this.project = parts[1] || null;
        this.file = decodeURIComponent(parts.slice(2).join("/")) || null;
    }

    /**
     * Set the active project
     */
    public setProject(
        project: string,
        template?: ProjectTemplate | null
    ): void {
        if (
            project?.toLowerCase() === this.project?.toLowerCase() &&
            template === null
        ) {
            return;
        }

        this.project = project;
        this.template = template ?? null;
        this.file = null;
        window.history.pushState({}, "", this.fullPath);
    }

    /**
     * Set the active file
     */
    public setFile(file: string): void {
        // a bit of a hack, but avoid displaying the Inform 7 main file in the URL
        const filename = file === "story.ni" ? null : file;

        if (filename === this.file) {
            if (window.location.pathname === "/" && this.project) {
                window.history.pushState({}, "", this.fullPath);
            }

            return;
        }

        this.file = filename?.replace(/^\//, "") || null;
        window.history.pushState({}, "", this.fullPath);
    }

    constructor() {
        makeAutoObservable(this);
        window.addEventListener("popstate", this.onPopState);
        this.parseUrl();
    }
}

export default new RouteStore();
