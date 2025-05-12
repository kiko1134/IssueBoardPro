import React, {useState} from 'react';
import {Layout} from 'antd';
import HeaderContent from "../layout/HeaderContent";
import SiderContent from "../layout/SiderContent";
import IssueBoardIndexPage from "../issueBoard/IssueBoardIndexPage";
import {FundProjectionScreenOutlined} from "@ant-design/icons";
import MembersPage from "../members/MembersPage";
import WorklogSection from "../worklog/WorklogSection";

const {Header, Sider, Content} = Layout;

interface IssueTrackerLayoutProps {
    onLogout: () => void;
}

const IssueTrackerLayout: React.FC<IssueTrackerLayoutProps> = ({onLogout}) => {

    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [selectedProjectName, setSelectedProjectName] = useState<string>('');
    //For the moment at the start of the app the state is empty string and only header is displayed. When project selected from header it load the sider and content.
    const [collapsed, setCollapsed] = useState(false);

    const [activeMenuKey, setActiveMenuKey] = useState('board');

    return (
        <Layout style={{height: '100vh', overflow: 'hidden'}}>
            {/* Header */}
            <Header
                style={{
                    backgroundColor: '#fff',
                    padding: '0 16px',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <HeaderContent onProjectSelect={(projectId, projectName) => {
                    setSelectedProjectId(projectId);
                    setSelectedProjectName(projectName);
                    setActiveMenuKey('board');
                }}
                               onLogout={onLogout}
                />
            </Header>

            {/* Body: Sider + Content */}
            {selectedProjectId ? <Layout>
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(c) => setCollapsed(c)}
                        width={200}
                    >
                        <SiderContent
                            projectName={selectedProjectName}
                            icon={<FundProjectionScreenOutlined/>}
                            collapsed={collapsed}
                            activeKey={activeMenuKey}
                            onMenuSelect={setActiveMenuKey}
                        />
                    </Sider>

                    <Content style={{padding: '10px'}}>
                        {activeMenuKey === 'members' ? (
                                <MembersPage projectId={Number(selectedProjectId)}/>
                            ) :
                            activeMenuKey === 'worklog' ?
                                <WorklogSection/>
                                :
                                (<IssueBoardIndexPage projectId={(Number(selectedProjectId))}/>)
                        }
                    </Content>
                </Layout>
                : undefined}
        </Layout>
    );
};

export default IssueTrackerLayout;