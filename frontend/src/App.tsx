import React from 'react';
import {Layout} from 'antd';
import HeaderContent from "./components/HeaderContent";
import SiderContent from "./components/SiderContent";
import IssueBoardIndexPage from "./components/IssueBoard/IssueBoardIndexPage";

const {Header, Sider, Content} = Layout;

const IssueTrackerLayout: React.FC = () => {


    return (
        <Layout style={{minHeight: '100vh'}}>
            {/* Header */}
            <Header
                style={{
                    backgroundColor: '#fff',
                    padding: '0 16px',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <HeaderContent/>
            </Header>

            {/* Body: Sider + Content */}
            <Layout>
                <Sider
                    // collapsible
                    width={200}
                    style={{background: '#f0f2f5', padding: '10px'}}
                >
                    <SiderContent/>
                </Sider>

                <Content style={{padding: '10px'}}>
                    <IssueBoardIndexPage/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default IssueTrackerLayout;

