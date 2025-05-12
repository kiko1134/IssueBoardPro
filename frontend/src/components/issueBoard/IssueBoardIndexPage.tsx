import React, {useEffect} from "react";
import IssueBoardFilterActions from "./IssueBoardFilterActions";
import IssueBoardContentPage from "./IssueBoardContentPage";
import {User} from "../../api/services/userService";
import {fetchProjectMembers} from "../../api/services/projectService";

interface IssueBoardIndexPageProps {
    projectId: number;
}


const IssueBoardIndexPage: React.FC<IssueBoardIndexPageProps> = ({projectId}) => {

    const [searchText, setSearchText] = React.useState<string>('');
    const [typeFilter, setTypeFilter] = React.useState<string | undefined>(undefined);
    const [priorityFilter, setPriorityFilter] = React.useState<string | undefined>(undefined);
    const [userFilters, setUserFilters] = React.useState<number[]>([]);
    const [users, setUsers] = React.useState<User[]>([]);
    const clearFilters = () => {
        setSearchText('');
        setTypeFilter(undefined);
        setPriorityFilter(undefined);
        setUserFilters([]);
    }

    useEffect(() => {
        fetchProjectMembers(projectId)
            .then(setUsers)
            .catch(() => console.error("Failed to load users"));
    }, [projectId]);

    return (
        <>
            <IssueBoardFilterActions
                users={users}
                selectedUsers={userFilters}
                onUserChange={setUserFilters}
                searchText={searchText}
                onSearchChange={setSearchText}
                selectedType={typeFilter}
                onTypeChange={setTypeFilter}
                selectedPriority={priorityFilter}
                onPriorityChange={setPriorityFilter}
                onClear={clearFilters}/>
            <IssueBoardContentPage projectId={projectId}
                                   searchText={searchText}
                                   typeFilter={typeFilter}
                                   priorityFilter={priorityFilter}
                                   userFilters={userFilters}
            />
        </>
    )
};

export default IssueBoardIndexPage;