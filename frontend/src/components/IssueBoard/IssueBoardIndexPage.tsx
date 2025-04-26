import React from "react";
import IssueBoardFilterActions from "./IssueBoardFilterActions";
import IssueBoardContentPage from "./IssueBoardContentPage";

interface IssueBoardIndexPageProps {
    projectId: number;
}


const IssueBoardIndexPage: React.FC<IssueBoardIndexPageProps> = ({projectId}) => {

    return (
        <>
            <IssueBoardFilterActions/>
            <IssueBoardContentPage projectId = {projectId}/>
        </>
    )
};

export default IssueBoardIndexPage;