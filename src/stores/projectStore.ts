import { observable, action } from "mobx";
import Axios from "axios";
import { v4 as uuid } from "uuid";
import { saveAs } from "file-saver";
import { basename } from "path";
import JSZip from "jszip";

import { downloadFile, readFile } from "services/filesystem/localFilesystemService";
import { startPersisting } from "services/filesystem/persistentFilesystemService";
import { getInterpreterUrl, getStandaloneInterpreterMeta } from "services/interpreters/interpreterService";
import { openTab } from "services/ide/tabService";
import ProjectService from "services/projects/ProjectService.class";

import compilationResultStore from "./compilationResultStore";
import materialsStore from "./materialsStore";

import { TabContentType, MaterialsFileType } from "types/enum";

export enum ProjectStoreState {
    waiting,
    loading,
    error,
    ready
}

export type ReleaseType = "gamefile" | "website";


/**
 * Currently open project
 */
class ProjectStore {
    // The project service, which tells us what kind of project is open
    @observable manager: ProjectService;

    // The load state of the project: "waiting" for the user to pick a project,
    // "loading" a chosen project and "ready" when everything's loaded and set up
    @observable loadState = ProjectStoreState.waiting;

    // The main file passed to the compiler
    @observable entryFile: MaterialsFile | null;

    // UUID (IFID) for the current project
    public uuid = uuid();

    private persistenceFunction: ( () => void ) | null = null;


    /**
     * Starts to compile the project and runs it in an interpreter when finished
     */
    compile = async( variant: CompilationVariant, compileOnly = false ): Promise<boolean> => {
        openTab( TabContentType.compiler );
        await this.manager.compile( variant );

        if( !compileOnly ) {
            if( compilationResultStore.success ) {
                openTab( TabContentType.interpreter );
            }

            if( compilationResultStore.indexUrl ) {
                openTab( TabContentType.projectIndex );
            }
        }

        return compilationResultStore.success;
    };


    /**
     * Gets the full interpreter URL for given story file URL
     */
    interpreterUrl = ( storyfileUrl?: string | null ): string => {
        return getInterpreterUrl( this.manager.interpreter, storyfileUrl );
    };


    /**
     * Manually persist the current state (e.g. when files are edited)
     */
    persistState = (): void => {
        if( this.persistenceFunction ) {
            this.persistenceFunction();
        }
    };


    /**
     * Create release version and download it
     */
    release = async( releaseType: ReleaseType ): Promise<boolean> => {
        const compilationSuccess = await this.compile( "release", true );
        const { storyfileLocalPath, storyfileRemoteUrl } = compilationResultStore;
        let storyfileData;

        if( !compilationSuccess ) {
            return false;
        }

        if( storyfileRemoteUrl ) {
            const gamefileRequest = await Axios.get(
                storyfileRemoteUrl,
                {
                    responseType: "arraybuffer"
                }
            );

            if( releaseType === "gamefile" ) {
                saveAs( new Blob( [ gamefileRequest.data ] ), basename( storyfileRemoteUrl ) );
                return true;
            }

            storyfileData = new Blob( [ gamefileRequest.data ] );
        }
        else if( storyfileLocalPath ) {
            if( releaseType === "gamefile" ) {
                downloadFile( storyfileLocalPath, true );
                return true;
            }

            storyfileData = new Blob( [ readFile( storyfileLocalPath, true ) ] );
        }
        else {
            throw new Error( "Can't find storyfile" );
        }

        // releaseType === "website"

        // get the website template
        const {  storyfileName, templateZipUrl } = getStandaloneInterpreterMeta( this.manager.interpreter );
        const websiteTemplateRequest = await Axios.get(
            templateZipUrl,
            {
                responseType: "arraybuffer"
            }
        );

        // add the storyfile to the zip
        const zip = await JSZip.loadAsync( new Blob( [ websiteTemplateRequest.data ] ) );

        if( this.manager.processReleaseFile ) {
            const releaseFileMeta = await this.manager.processReleaseFile( storyfileName, storyfileData );
            zip.file( releaseFileMeta.name, releaseFileMeta.content );
        }
        else {
            zip.file( storyfileName, storyfileData );
        }

        // add materials files
        this.manager.filterReleaseFiles( materialsStore.files.filter( file => file.type !== MaterialsFileType.folder ) )
            .forEach( file => zip.file(
                materialsStore.getPath( file ),
                new Blob( [ readFile( materialsStore.getFilesystemPath( file ), file.isBinary ) ] )
            ) );

        // send the zip to the user
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs( blob, "release.zip" );

        return true;
    };


    /**
     * Sets the entry file
     */
    @action setEntryFile = ( file: MaterialsFile | null ): void => {
        this.entryFile = file;
    };


    /**
     * Sets the project service
     */
    setManager = ( manager: ProjectService ): void => {
        this.manager = manager;
    };


    /**
     * Calling this tells the project store that loading the project has completed
     */
    @action setReady = (): void => {
        if( this.manager.welcomePage ) {
            openTab( TabContentType.welcome, { closable: true });
        }

        this.setState( ProjectStoreState.ready );

        // Start persisting the filesystem to permanent storage
        this.persistenceFunction = startPersisting( this.manager.id );
    };


    /**
     * Sets the loading state
     */
    @action setState = ( state: ProjectStoreState ): void => {
        this.loadState = state;
    };


    /**
     * Set a new UUID
     */
    @action setUUID = ( uuid: string ): void => {
        this.uuid = uuid;
    }
}

export default new ProjectStore();