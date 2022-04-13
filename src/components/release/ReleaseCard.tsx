import React, { ReactNode } from "react";
import { observer } from "mobx-react";
import { Card, CardContent, Content, CardFooter, CardFooterItem, CardHeader, CardHeaderTitle } from "bloomer";

interface ReleaseCardElementProps {
    buttonText: string;
    children?: ReactNode;
    onBuild: () => void;
    title: string;
}

export const ReleaseCardElement: React.FC<ReleaseCardElementProps> = ({ buttonText, children, onBuild, title }) => <Card>
    <CardHeader>
        <CardHeaderTitle>
            {title}
        </CardHeaderTitle>
    </CardHeader>
    <CardContent>
        <Content>
            {children}
        </Content>
    </CardContent>
    <CardFooter>
        <CardFooterItem href="#" onClick={onBuild}>
            {buttonText}
        </CardFooterItem>
    </CardFooter>
</Card>;


/**
 * A card that contains a release option
 */
const ReleaseCard: React.FC<ReleaseCardElementProps> = observer( props => {
    return <ReleaseCardElement {...props} />;
});

export default ReleaseCard;
