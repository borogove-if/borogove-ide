import React from "react";
import { observer } from "mobx-react";
import { Button, Title } from "bloomer";
import Axios from "axios";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";

interface SnippetReleaseInfoElementProps {
    onPublish: () => void;
}

export const SnippetReleaseInfoElement: React.FC<SnippetReleaseInfoElementProps> = ({ onPublish }) => <section>
    <p>
        Create a shareable link to the snippet by pressing the button below.
    </p>

    <div className="has-text-centered mt-4">
        <Button isColor="info" isSize="large" onClick={onPublish}>
            Publish
        </Button>
    </div>

    <hr />

    <Title size={4}>
        Download
    </Title>

    <p>
        Download the snippet instead with these options:
    </p>
</section>;
// --> "normal" release options come right after this


/**
 * Publishing snippets
 */
const SnippetReleaseInfo: React.FC = observer( () => {
    const publish = (): void => {
        if( projectStore.entryFile ) {
            Axios({
                url: process.env.REACT_APP_SNIPPETS_POST_API_URL + "/snippet",
                method: "POST",
                data: {
                    code: materialsStore.getContents( projectStore.entryFile ),
                    revision: 1,
                    template: projectStore.manager.template
                }
            });
        }
    };

    return <SnippetReleaseInfoElement onPublish={publish} />;
});

export default SnippetReleaseInfo;