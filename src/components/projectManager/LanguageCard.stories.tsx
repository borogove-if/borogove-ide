import React from "react";

import { storiesOf } from "@storybook/react";
import { LanguageCardElement } from "./LanguageCard";
import { action } from "@storybook/addon-actions";
import ProjectTemplate from "services/projects/ProjectTemplate.class";

const templates: ProjectTemplate[] = [
    {
        id: "template1",
        files: [],
        name: "Template One"
    },
    {
        id: "template2",
        files: [],
        name: "Template Two"
    }
];

storiesOf( "LanguageCard", module )
    .add(
        "Without subtitle, without templates, no existing project",
        () => <LanguageCardElement name="Inform 7"
                                   onClickContinue={action( "Continue project" )}
                                   onClickCreate={action( "Create project" )}
                                   projectExists={false}
                                   templates={[]}
                                   variant="ide" />
    )
    .add(
        "With subtitle, without templates, no existing project",
        () => <LanguageCardElement name="Inform 7"
                                   onClickContinue={action( "Continue project" )}
                                   onClickCreate={action( "Create project" )}
                                   projectExists={false}
                                   subtitle="with Vorple"
                                   templates={[]}
                                   variant="ide" />
    )
    .add(
        "Without subtitle, with templates, existing project",
        () => <LanguageCardElement name="Inform 7"
                                   onClickContinue={action( "Continue project" )}
                                   onClickCreate={action( "Create project" )}
                                   projectExists={true}
                                   templates={templates}
                                   variant="ide" />
    )
    .add(
        "With subtitle, with templates, existing project",
        () => <LanguageCardElement name="Inform 7"
                                   onClickContinue={action( "Continue project" )}
                                   onClickCreate={action( "Create project" )}
                                   projectExists={true}
                                   subtitle="with Vorple"
                                   templates={templates}
                                   variant="ide" />
    )
    .add(
        "Without subtitle, with templates, snippets",
        () => <LanguageCardElement name="Inform 7"
                                   onClickContinue={action( "Continue project" )}
                                   onClickCreate={action( "Create project" )}
                                   projectExists={false}
                                   templates={templates}
                                   variant="snippets" />
    )
    .add(
        "With subtitle, without templates, snippets",
        () => <LanguageCardElement name="Inform 7"
                                   onClickContinue={action( "Continue project" )}
                                   onClickCreate={action( "Create project" )}
                                   projectExists={false}
                                   subtitle="with Vorple"
                                   templates={[]}
                                   variant="snippets" />
    );
