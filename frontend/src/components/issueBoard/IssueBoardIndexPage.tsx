import React from "react";
import IssueBoardFilterActions from "./IssueBoardFilterActions";
import IssueBoardContentPage from "./IssueBoardContentPage";

;

interface IssueBoardIndexPageProps {
    projectId: number;
}


const IssueBoardIndexPage: React.FC<IssueBoardIndexPageProps> = ({projectId}) => {

    const [searchText, setSearchText] = React.useState<string>('');
    const [typeFilter, setTypeFilter] = React.useState<string | undefined>(undefined);
    const [priorityFilter, setPriorityFilter] = React.useState<string | undefined>(undefined);
    const [userFilters, setUserFilters] = React.useState<number[]>([]);
    const clearFilters = () => {
        setSearchText('');
        setTypeFilter(undefined);
        setPriorityFilter(undefined);
        setUserFilters([]);
    }

    return (
        <>
            <IssueBoardFilterActions
                projectId={projectId}
                selectedUsers={userFilters}
                onUserChange={setUserFilters}
                searchText={searchText}
                onSearchChange={setSearchText}
                selectedType={typeFilter}
                onTypeChange={setTypeFilter}
                selectedPriority={priorityFilter}
                onPriorityChange={setPriorityFilter}
                onClear={clearFilters}/>

            <IssueBoardContentPage
                projectId={projectId}
                searchText={searchText}
                typeFilter={typeFilter}
                priorityFilter={priorityFilter}
                userFilters={userFilters}
            />
        </>
    )
};

export default IssueBoardIndexPage;