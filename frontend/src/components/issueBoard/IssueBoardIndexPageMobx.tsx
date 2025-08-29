import React from "react";
import { observer } from "mobx-react-lite";
import IssueBoardFilterActions from "./IssueBoardFilterActions";
import { useUI } from "../../stores/rootStore";
import IssueBoardContentPageMobx from "./IssueBoardContentPageMobx";

interface IssueBoardIndexPageProps {
    projectId: number;
}

const IssueBoardIndexPageMobx: React.FC<IssueBoardIndexPageProps> = observer(({ projectId }) => {
    const ui = useUI();

    // синхронизираме projectId в UI store
    React.useEffect(() => { ui.setProjectId(projectId); }, [projectId,ui]);

    return (
        <>
            <IssueBoardFilterActions
                projectId={projectId}
                selectedUsers={ui.userFilters}
                onUserChange={(v) => ui.setUserFilters(v)}
                searchText={ui.searchText}
                onSearchChange={(v) => ui.setSearchText(v)}
                selectedType={ui.typeFilter}
                onTypeChange={(v) => ui.setTypeFilter(v)}
                selectedPriority={ui.priorityFilter}
                onPriorityChange={(v) => ui.setPriorityFilter(v)}
                onClear={() => ui.clearAllFilters()}
            />
            <IssueBoardContentPageMobx projectId={projectId} />
        </>
    );
});

export default IssueBoardIndexPageMobx;
