export default abstract class ProjectTemplate {
    // Unique id for the template
    abstract id: string;

    // Files defined in the template
    abstract files: (MaterialsFile & { contents?: string })[];

    // Where to put the cursor in the main source file when it first opens.
    // Format is { column: number, lineNumber: number }.
    // Default is the start of the first line (column 1, lineNumber 1.)
    initialCursorPosition?: { column: number; lineNumber: number };

    // The title of the template shown in the New Project page
    abstract name: string;

    // Template files that are loaded as files instead of from templates
    remoteAssets?: (string | { url: string; manifest: string })[];

    // The name of the manifest file that lists the assets
    manifestFile? = "manifest.json";

    // If true, the project isn't offered as an option for new projects or snippets
    deprecated? = false;

    // If false, can't be used as a template for snippets
    isSnippetTemplate? = true;
}
