import React, {useState} from 'react';
import {Layout} from 'antd';
import HeaderContent from "./components/layout/HeaderContent";
import SiderContent from "./components/layout/SiderContent";
import IssueBoardIndexPage from "./components/IssueBoard/IssueBoardIndexPage";

const {Header, Sider, Content} = Layout;

const IssueTrackerLayout: React.FC = () => {

    //For the moment at the start of the app the state is empty string and only header is displayed. When project selected from header it load the sider and content.
    const [selectedProject, setSelectedProject] = useState<string>("");


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
                <HeaderContent onProjectSelect={setSelectedProject}/>
            </Header>

            {/* Body: Sider + Content */}
            {selectedProject.length > 0 ? <Layout>
                    <Sider
                        collapsible
                        width={200}
                        style={{}}
                    >
                        <SiderContent projectName={selectedProject}/>
                    </Sider>

                    <Content style={{padding: '10px'}}>
                        <IssueBoardIndexPage/>
                    </Content>
                </Layout>
                : undefined}
        </Layout>
    );
};

export default IssueTrackerLayout;

