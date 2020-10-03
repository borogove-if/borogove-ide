export declare global {
    type AppVariant = "ide" | "snippets";
    type CompilationVariant = "debug" | "release";

    interface ProjectLanguage {
        compilerReportType?: "staged" | "simple";
        description: string;
        id: string;
        name: string;
        projectService: ProjectService;
        subtitle?: string;
    }
}
