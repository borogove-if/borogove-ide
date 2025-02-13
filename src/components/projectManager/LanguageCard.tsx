import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import {
    Card,
    CardContent,
    Content,
    Title,
    Subtitle,
    CardFooter,
    CardFooterItem,
    Select,
    Label
} from "bloomer";
import { join } from "path";
import { TiMediaPlay } from "react-icons/ti";

import { appVariant, isSnippetsVariant } from "services/app/env";
import ProjectService from "services/projects/ProjectService.class";
import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { getFS } from "services/filesystem/localFilesystemService";
import {
    PERSISTENT_FILESYSTEM_DIR,
    BOROGOVE_SETTINGS_FILE
} from "services/filesystem/filesystemConstants";

import materialsStore, { FSLoadState } from "stores/materialsStore";
import routeStore from "stores/routeStore";

import "./LanguageCard.scss";

interface LanguageCardElementProps {
    name: string;
    onClickContinue: (e: React.MouseEvent) => void;
    onClickCreate: (e: React.MouseEvent, template: ProjectTemplate) => void;
    projectExists: boolean;
    subtitle?: string;
    templates: ProjectTemplate[];
    variant: AppVariant;
}

export const LanguageCardElement: React.FC<LanguageCardElementProps> = observer(
    ({
        name,
        onClickContinue,
        onClickCreate,
        projectExists,
        subtitle,
        templates,
        variant
    }) => {
        const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
        const chooseTemplate = (
            e: React.FormEvent<HTMLSelectElement>
        ): void => {
            setSelectedTemplate(
                templates[Number((e.target as HTMLSelectElement).value)]
            );
        };
        const isIdeVariant = variant === "ide";

        const startNewProject = (e: React.MouseEvent): false => {
            if (
                projectExists &&
                !confirm(
                    `Start a new project? The new project will overwrite the existing ${name}${subtitle ? " " + subtitle : ""} project.`
                )
            ) {
                return false;
            }

            onClickCreate(e, selectedTemplate);

            return false;
        };

        return (
            <Card className={`language-card ${variant}-variant`}>
                <CardContent
                    className="is-clickable"
                    onClick={projectExists ? onClickContinue : startNewProject}>
                    <Content>
                        <div className="titles">
                            <Title>{name}</Title>
                            {subtitle && <Subtitle>{subtitle}</Subtitle>}
                        </div>
                    </Content>
                </CardContent>
                <CardFooter>
                    {isIdeVariant && projectExists && (
                        <CardFooterItem href="#" onClick={onClickContinue}>
                            <div>Continue saved project</div>
                        </CardFooterItem>
                    )}
                    <div className="card-footer-item">
                        <div className="new-project-footer">
                            <Label>
                                {isIdeVariant ? "New project" : "Template"}
                            </Label>
                            <div className="new-project-actions">
                                <div>
                                    {templates.length === 0 && "Empty project"}
                                    {templates.length === 1 &&
                                        templates[0].name}
                                    {templates.length > 1 && (
                                        <Select onChange={chooseTemplate}>
                                            {templates.map(
                                                (template, index) => (
                                                    <option
                                                        key={template.name}
                                                        value={index}>
                                                        {template.name}
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                    )}
                                </div>
                                <div className="start-new-project-button">
                                    <a
                                        href="#"
                                        onClick={startNewProject}
                                        title="Create new project">
                                        <TiMediaPlay size="2rem" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        );
    }
);

interface LanguageCardProps {
    projectService: ProjectService;
}

/**
 * Shows one language in the new project page.
 */
const LanguageCard: React.FC<LanguageCardProps> = observer(
    ({ projectService }) => {
        const [projectExists, setProjectExists] = useState(false);

        // check for existing projects
        useEffect(() => {
            if (isSnippetsVariant) {
                return;
            }

            const fs: any = getFS();

            try {
                fs.stat(
                    join(
                        PERSISTENT_FILESYSTEM_DIR,
                        projectService.id,
                        BOROGOVE_SETTINGS_FILE
                    ),
                    (err: Error) => {
                        if (!err) {
                            setProjectExists(true);
                        }
                    }
                );
            } catch (e) {
                // do nothing – file and therefore project doesn't exist
            }
        }, [materialsStore.fsState]);

        // wait until fileystem has mounted
        if (materialsStore.fsState !== FSLoadState.ready) {
            return null;
        }

        const templates = projectService.templates.filter(template => {
            // filter out deprecated templates
            if (template.deprecated) {
                return false;
            }

            // for snippets, filter out templates that can't be used for snippets
            if (isSnippetsVariant && !template.isSnippetTemplate) {
                return false;
            }

            return true;
        });

        const continueProject = (e: React.MouseEvent): void => {
            e.preventDefault();
            routeStore.setProject(projectService.id);
        };

        const startProject = (
            e: React.MouseEvent,
            template?: ProjectTemplate
        ): void => {
            e.preventDefault();
            routeStore.setProject(projectService.id, template);
        };

        return (
            <LanguageCardElement
                name={projectService.name}
                onClickContinue={continueProject}
                onClickCreate={startProject}
                projectExists={projectExists}
                subtitle={projectService.subtitle}
                templates={templates}
                variant={appVariant}
            />
        );
    }
);

export default LanguageCard;
