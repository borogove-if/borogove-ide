import React from "react";
import { observer } from "mobx-react";
import { Title, Container, Navbar, NavbarBrand, NavbarItem } from "bloomer";

import projectServices from "services/projects/projectServiceList";
import ProjectService from "services/projects/ProjectService.class";

import LanguageCard from "./LanguageCard";

import "./ProjectManager.scss";

interface ProjectManagerElementProps {
    projectServices: readonly ProjectService[];
}

export const ProjectManagerElement: React.FC<ProjectManagerElementProps> = observer( ({ projectServices }) => <div>
    <Container id="project-manager">
        <Navbar className="is-white">
            <NavbarBrand>
                <NavbarItem>
                    <Title id="borogove-main-logo">
                        Borogove
                    </Title>
                </NavbarItem>
                <NavbarItem>
                    <Title>
                        Project Manager
                    </Title>
                </NavbarItem>
            </NavbarBrand>
        </Navbar>
        <div id="language-cards-list">
            {projectServices.map( project => <LanguageCard key={project.id} projectService={project} /> )}
        </div>
    </Container>
</div> );

/**
 * New project page
 */
const ProjectManager: React.FC = observer( () => {
    return <ProjectManagerElement projectServices={projectServices} />;
});

export default ProjectManager;