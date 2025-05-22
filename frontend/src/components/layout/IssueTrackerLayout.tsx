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
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenuKey, setActiveMenuKey] = useState('board');

    const projectIdNum = Number(selectedProjectId);

    return (
        <Layout style={{height: '100vh', overflow: 'hidden'}}>
            {/* Header */}
            <Header style={{
                backgroundColor: '#fff',
                padding: '0 16px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <HeaderContent
                    onProjectSelect={(projectId, projectName) => {
                        setSelectedProjectId(projectId);
                        setSelectedProjectName(projectName);
                        setActiveMenuKey('board');
                    }}
                    onLogout={onLogout}
                />
            </Header>

            {selectedProjectId && (
                <Layout>
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
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
                            <MembersPage projectId={projectIdNum}/>
                        ) : activeMenuKey === 'worklog' ? (
                            <WorklogSection projectId={projectIdNum}/>
                        ) : (
                            <IssueBoardIndexPage projectId={projectIdNum}/>
                        )}
                    </Content>
                </Layout>
            )}
        </Layout>
    );
};

export default IssueTrackerLayout;
