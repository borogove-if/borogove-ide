import React from "react";
import { Container, Button, Title } from "bloomer";

interface ProjectLoadingErrorElementProps {
    onRetry: () => void;
}

export const ProjectLoadingErrorElement: React.FC<ProjectLoadingErrorElementProps> = ({ onRetry }) => <Container>
    <Title>Oops! Something went wrong.</Title>
    <p>
        Project resources didn't load correctly.
    </p>
    <p>
        <Button onClick={onRetry}>
            Try again
        </Button>
    </p>
</Container>;

/**
 * Error message when loading project files has failed.
 */
const ProjectLoadingError: React.FC = () => {
    const onRetry = (): void => window.location.reload();

    return <ProjectLoadingErrorElement onRetry={onRetry} />;
};

export default ProjectLoadingError;