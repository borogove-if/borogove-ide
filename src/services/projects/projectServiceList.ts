import ProjectService from "./ProjectService.class";

import dialogProjectService from "./dialog/dialogProjectService";
import hugoProjectService from "./hugo/hugoProjectService";
import inform6VanillaProjectService from "./inform6/inform6VanillaProjectService";
import inform6VorpleProjectService from "./inform6/Inform6VorpleProjectService";
import inform7VanillaProjectService from "./inform7/inform7VanillaProjectService";
import inform7VorpleProjectService from "./inform7/inform7VorpleProjectService";


/**
 * This is the list of all project options available in the New Project page.
 *
 * If there is only one project service in this list, and that project has only
 * one template, the New Project page is skipped and that project starts automatically.
 */
const projectServiceList: ReadonlyArray<ProjectService> = [
    inform7VanillaProjectService,
    inform7VorpleProjectService,
    inform6VanillaProjectService,
    inform6VorpleProjectService,
    hugoProjectService,
    dialogProjectService
];

export default projectServiceList;