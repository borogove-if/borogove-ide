import { compileI7 } from "services/compilers/inform7CompilerService";

import materialsStore, { MaterialsFileType } from "stores/materialsStore";
import projectStore, { ProjectStoreState } from "stores/projectStore";
import settingsStore from "stores/settingsStore";

import ProjectService from "../ProjectService.class";
import ProjectTemplate from "../ProjectTemplate.class";

export type I7CompilerVersion = "10.1.0" | "6M62" | "6G60";
export const DEFAULT_I7_COMPILER_VERSION = process.env
    .REACT_APP_DEFAULT_I7_COMPILER_VERSION as I7CompilerVersion;

/**
 * Initialize an Inform 7 project
 */
export default abstract class Inform7ProjectService extends ProjectService {
    public compile = compileI7;
    public compilerReportType: "staged" = "staged"; // this looks silly, but without the "staged" type, Typescript can't make the connection to the type in the parent class
    public hasSyntaxHighlighting = true;
    public language = "inform7";
    public name = "Inform 7";
    public showFilesystemCompilerOptions = false; // I7 always has the same entry point and no include paths
    public storyFileFormat = "glulx";
    public tabIndent = true;

    public generateUUIDFile(): void {
        const { uuid } = projectStore;

        // already exists, don't duplicate
        if (materialsStore.findByFullPath("/uuid.txt")) {
            return;
        }

        materialsStore.addMaterialsFile(uuid, {
            name: "uuid.txt",
            locked: true,
            type: MaterialsFileType.text
        });
    }

    public initProject = async (
        template?: ProjectTemplate,
        preferRestore = false
    ): Promise<void> => {
        const initSuccess = await this.init(template, preferRestore);

        if (initSuccess) {
            this.generateUUIDFile();

            const storedCompilerVersion = settingsStore.getSetting(
                "language",
                "compilerVersion",
                DEFAULT_I7_COMPILER_VERSION
            );

            if (
                this.compilerVersions &&
                this.compilerVersions.length > 0 &&
                !this.compilerVersions.includes(storedCompilerVersion)
            ) {
                // if an invalid compiler version has been stored to the settings, fall back to the project default
                const projectDefaultCompiler = this.compilerVersions[0];
                projectStore.compilerVersion = projectDefaultCompiler;
                settingsStore.saveSetting(
                    "language",
                    "compilerVersion",
                    projectDefaultCompiler
                );
            } else {
                projectStore.compilerVersion = storedCompilerVersion;
            }

            projectStore.setReady();
        } else {
            projectStore.setState(ProjectStoreState.error);
        }
    };
}
