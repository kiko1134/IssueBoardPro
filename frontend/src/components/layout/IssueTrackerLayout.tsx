import React, {useState} from 'react';
import {Layout} from 'antd';
import HeaderContent from "../layout/HeaderContent";
import SiderContent from "../layout/SiderContent";
import IssueBoardIndexPage from "../IssueBoard/IssueBoardIndexPage";
import {FundProjectionScreenOutlined} from "@ant-design/icons";

const {Header, Sider, Content} = Layout;

const IssueTrackerLayout: React.FC = () => {

    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [selectedProjectName, setSelectedProjectName] = useState<string>('');
    //For the moment at the start of the app the state is empty string and only header is displayed. When project selected from header it load the sider and content.
    const [collapsed, setCollapsed] = useState(false);

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
                }}/>
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
                            collapsed={collapsed}/>
                    </Sider>

                    <Content style={{padding: '10px'}}>
                        <IssueBoardIndexPage projectId={(Number(selectedProjectId))}/>
                    </Content>
                </Layout>
                : undefined}
        </Layout>
    );
};

export default IssueTrackerLayout;