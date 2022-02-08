import React from "react";
import { observer } from "mobx-react";
import { Title } from "bloomer";

import ModalTemplate from "components/layout/modals/ModalTemplate";
import { okButton } from "components/layout/modals/ModalTemplate";

import ideStateStore from "stores/ideStateStore";

interface OverviewInfoElementProps {
    ideURL?: string;
    onClose: () => void;
    publishingURL?: string;
    snippetsURL?: string;
}

export const OverviewInfoElement: React.FC<OverviewInfoElementProps> = ({ ideURL, onClose, publishingURL, snippetsURL }) => {
    const buttons: ModalButton[] = [ okButton ];

    return <ModalTemplate buttons={buttons} header="Borogove Online Apps" okCallback={onClose} wide>
        {ideURL && <section>
            <Title isSize={4}>
                IDE
            </Title>

            <p>
                The Borogove IDE at <a href={ideURL}>borogove.app</a> is an online
                editor and compiler for different Interactive Fiction languages.
                The games can be tested while writing them with the included
                online interpreters.
            </p>

            <p>
                Games created with the IDE can be compiled and downloaded for
                sharing with others{publishingURL && <span> or for uploading
                    to <a href={publishingURL}>borogove.io</a></span>}.
            </p>
        </section>}

        {snippetsURL && <section>
            <Title isSize={4}>
                Snippets
            </Title>

            <p>
                The Snippets service
                at <a href={snippetsURL}>snippets.borogove.app</a> can be used
                to share short runnable code snippets. When you save a snippet,
                you get a link that can be shared with others. Opening a snippet
                through the link opens the editor with the snippet code and
                playable preview.
            </p>
        </section>}

        {publishingURL && <section>
            <Title isSize={4}>
                Publishing
            </Title>

            <p>
                At <a href={publishingURL}>borogove.io</a> you can upload
                Interactive Fiction games and get a link to share with others.
                The uploaded games can be optionally included in the public
                gallery on the site's front page.
            </p>
        </section>}

        <hr />

        <section>
            <p>
                Found a bug? Post a ticket to <a href="https://github.com/borogove-if/borogove-ide/issues" target="_blank" rel="noreferrer">the GitHub repository</a>!
            </p>
        </section>

    </ModalTemplate>;
};


/**
 * Info page on the different parts of the project
 */
const OverviewInfo: React.FC = observer( () => {
    return <OverviewInfoElement onClose={ideStateStore.closeModal}
                                ideURL={process.env.REACT_APP_IDE_BASE_URL}
                                publishingURL={process.env.REACT_APP_PUBLISHING_BASE_URL}
                                snippetsURL={process.env.REACT_APP_SNIPPETS_BASE_URL} />;
});

export default OverviewInfo;
