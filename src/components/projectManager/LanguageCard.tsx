import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Card, CardContent, Content, Title, Subtitle, CardFooter, CardFooterItem, Select, Label } from "bloomer";
import { join } from "path";
import { TiMediaPlay } from "react-icons/ti";

import ProjectService from "services/projects/ProjectService.class";
import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { getFS } from "services/filesystem/localFilesystemService";
import { PERSISTENT_FILESYSTEM_DIR, BOROGOVE_SETTINGS_FILE } from "services/filesystem/filesystemConstants";

import materialsStore from "stores/materialsStore";

import "./LanguageCard.scss";

interface LanguageCardElementProps {
    name: string;
    onClickContinue: ( e: React.MouseEvent ) => void;
    onClickCreate: ( e: React.MouseEvent, template: ProjectTemplate ) => void;
    projectExists: boolean;
    subtitle?: string;
    templates: ProjectTemplate[];
}

export const LanguageCardElement: React.FC<LanguageCardElementProps> = observer( ({ name, onClickContinue, onClickCreate, projectExists, subtitle, templates }) => {
    const [ selectedTemplate, setSelectedTemplate ] = useState( templates[ 0 ] );
    const chooseTemplate = ( e: React.FormEvent<HTMLSelectElement> ): void => {
        setSelectedTemplate( templates[ Number( ( e.target as HTMLSelectElement ).value ) ] );
    };

    const startNewProject = ( e: React.MouseEvent ): false => {
        if( projectExists && !confirm( `Start a new project? The new project will overwrite the existing ${name}${subtitle ? " " + subtitle : ""} project.` ) ) {
            return false;
        }

        onClickCreate( e, selectedTemplate );

        return false;
    };

    return <Card className="language-card">
        <CardContent className="is-clickable" onClick={projectExists ? onClickContinue : startNewProject}>
            <Content>
                <div className="titles">
                    <Title>
                        {name}
                    </Title>
                    {subtitle && <Subtitle>
                        {subtitle}
                    </Subtitle>}
                </div>
            </Content>
        </CardContent>
        <CardFooter>
            {projectExists && <CardFooterItem href="#" onClick={onClickContinue}>
                <div>
                    Continue saved project
                </div>
            </CardFooterItem>}
            <div className="card-footer-item">
                <div className="new-project-footer">
                    <Label>
                        New project
                    </Label>
                    <div className="new-project-actions">
                        <div>
                            {templates.length === 1 && templates[0].name}
                            {templates.length > 1 && <Select onChange={chooseTemplate}>
                                {templates.map( ( template, index ) => <option key={template.name} value={index}>
                                    {template.name}
                                </option> )}
                            </Select>}
                        </div>
                        <div className="start-new-project-button">
                            <a href="#" onClick={startNewProject} title="Create new project">
                                <TiMediaPlay size="2rem" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </CardFooter>
    </Card>;
});

interface LanguageCardProps {
    projectService: ProjectService;
}

/**
 * Shows one language in the new project page.
 */
const LanguageCard: React.FC<LanguageCardProps> = observer( ({ projectService }) => {
    if( !materialsStore.fsReady ) {
        // wait until fileystem has mounted
        return null;
    }

    const [ projectExists, setProjectExists ] = useState( false );

    // check for existing projects
    useEffect( () => {
        const fs: any  = getFS();   // eslint-disable-line

        try {
            fs.stat( join( PERSISTENT_FILESYSTEM_DIR, projectService.id, BOROGOVE_SETTINGS_FILE ), ( err: object ) => {
                if( !err ) {
                    setProjectExists( true );
                }
            });
        }
        catch( e ) {
            // do nothing – file and therefore project doesn't exist
        }
    }, [] );

    const continueProject = ( e: React.MouseEvent ): void => {
        e.preventDefault();
        projectService.initProject();
    };

    const startProject = ( e: React.MouseEvent, template?: ProjectTemplate ): void => {
        e.preventDefault();
        projectService.initProject( template || projectService.templates[0] );
    };

    return <LanguageCardElement name={projectService.name}
                                onClickContinue={continueProject}
                                onClickCreate={startProject}
                                projectExists={projectExists}
                                subtitle={projectService.subtitle}
                                templates={projectService.templates} />;
});

export default LanguageCard;
