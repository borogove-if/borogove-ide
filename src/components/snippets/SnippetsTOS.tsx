import React from "react";
import { Title } from "bloomer";
import { observer } from "mobx-react";

import ModalTemplate, { okButton } from "components/layout/modals/ModalTemplate";

import ideStateStore from "stores/ideStateStore";

interface SnippetsTOSElementProps {
    onClose: () => void;
}

export const SnippetsTOSElement: React.FC<SnippetsTOSElementProps> = ({ onClose }) => <ModalTemplate buttons={[ okButton ]} header="Terms of Service" okCallback={onClose} wide>
    <Title size={1}>
        Terms of Service
    </Title>

    <p>
        By using this Service you agree to the terms listed in this document.
    </p>

    <p>
        We reserve the right to modify or terminate the Service or your access to the Service for any reason, without notice, at any time, and without liability to you.
    </p>

    <Title size={2}>
        Acceptable Use
    </Title>

    <p>
        The following is a list of explicitly prohibited actions that may result in removal of content:
    </p>

    <ul className="bulleted-list">
        <li>
            Publishing unlawful, misleading, malicious, or discriminatory content
        </li>
        <li>
            Spamming, i.e. publishing content whose only purpose is to promote a product or service
        </li>
        <li>
            Publishing content that promotes or participates in racial intolerance, sexism, hate crimes, hate speech,
            intolerance to any single individual or groups of individuals, or promotes or incites criminal activity or self-harm
        </li>
        <li>
            Publishing content that without permission claims or implies that it was created by or is endorsed by this web site, another individual, or a third party
        </li>
        <li>
            Violating copyright by publishing copyrighted content without explicit permission from the copyright holders
        </li>
        <li>
            Hacking, phishing, or spreading malware, or misleading other users to become victims of such activities
        </li>
        <li>
            Hacking, maliciously manipulating, or misrepresenting this web site's interface in any way
        </li>
    </ul>

    <p>
        We reserve the right to remove the content you have published at any time without notice if you abuse the Service or violate these terms.
        You are responsible for the content you have published and are subject to any applicable legal restrictions.
    </p>


    <Title size={2}>
        Rights
    </Title>

    <p>
        We claim no rights over your content. However, you are not allowed to claim that this web site or its authors endorse your content in any way unless we have agreed otherwise in writing.
    </p>

    <p>
        By publishing your content, you grant anyone the right to view and play the content free of charge via this web site or embedded to another web site or service.
    </p>

    <p>
        We will not sell or authorise third parties to sell your content without your written consent.
    </p>


    <Title size={2}>
        Warranty
    </Title>

    <p>
        This web site and Service is provided "as is", without warranty of any kind, express or implied.
        In no event shall the authors or copyright holders be liable for any claim, damages or other liability,
        whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software
        or the use or other dealings in the website or related services.
    </p>


    <Title size={2}>
        Requests for removal
    </Title>

    {process.env.REACT_APP_FLAGGING_FORM_URL && <p>
        To request the removal of a snippet that violates these conditions, please fill
        out <a href={process.env.REACT_APP_FLAGGING_FORM_URL.split( "{id}" ).join( "" )} rel="noreferrer" target="_blank">this form</a>.
    </p>}

    <p>
        As content is published anonymously, in most cases we have no means to verify the original author of content. Therefore published content cannot be removed by request unless it explicitly violates the terms described in this document.
    </p>
</ModalTemplate>;


/**
 * Terms of Service for snippets
 */
const SnippetsTOS: React.FC = observer( () => {
    return <SnippetsTOSElement onClose={ideStateStore.closeModal} />;
});

export default SnippetsTOS;
