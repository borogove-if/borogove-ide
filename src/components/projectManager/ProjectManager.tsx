import React from "react";
import { observer } from "mobx-react";
import { Container } from "bloomer";
import NavHeader from "components/layout/navHeader/NavHeader";

import projectServices from "services/projects/projectServiceList";
import ProjectService from "services/projects/ProjectService.class";
import { isIdeVariant } from "services/app/env";

import LanguageCard from "./LanguageCard";

import "./ProjectManager.scss";

interface ProjectManagerElementProps {
    projectServices: readonly ProjectService[];
}

export const ProjectManagerElement: React.FC<ProjectManagerElementProps> = observer( ({ projectServices }) => {
    const title = isIdeVariant ? "Project Manager" : "Snippets";

    return <div>
        <Container id="project-manager">
            <NavHeader title={title} />
            <div id="language-cards-list">
                {projectServices.map( project => <LanguageCard key={project.id} projectService={project} /> )}
            </div>
        </Container>
    </div>;
});


/**
 * New project page
 */
const ProjectManager: React.FC = () => {
    return <ProjectManagerElement projectServices={projectServices} />;
};

export default ProjectManager;