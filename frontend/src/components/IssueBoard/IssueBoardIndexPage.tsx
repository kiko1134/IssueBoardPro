import React from "react";
import IssueBoardFilterActions from "./IssueBoardFilterActions";
import IssueBoardContentPage from "./IssueBoardContentPage";


const IssueBoardIndexPage: React.FC = () => {

    return (
        <>
            <IssueBoardFilterActions/>
            <IssueBoardContentPage/>
        </>
    )
};

export default IssueBoardIndexPage;