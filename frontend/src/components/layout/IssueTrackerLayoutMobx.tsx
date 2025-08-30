import React from "react";
import { Layout } from "antd";
import SiderContent from "../layout/SiderContent";
import { FundProjectionScreenOutlined } from "@ant-design/icons";
import MembersPage from "../members/MembersPage";
import WorklogSection from "../worklog/WorklogSection";
import { observer } from "mobx-react-lite";
import { useUI } from "../../stores/rootStore";
import IssueBoardIndexPageMobx from "../issueBoard/IssueBoardIndexPageMobx";
import HeaderContentMobx from "../layout/HeaderContentMobx";

const { Header, Sider, Content } = Layout;

interface IssueTrackerLayoutProps {
    onLogout: () => void;
}

const IssueTrackerLayoutMobx: React.FC<IssueTrackerLayoutProps> = observer(({ onLogout }) => {
    const ui = useUI();

    const projectIdNum = ui.projectId ?? 0;

    return (
        <Layout style={{ height: "100vh", overflow: "hidden" }}>
            <Header style={{ backgroundColor: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0" }}>
                <HeaderContentMobx
                    onProjectSelect={(projectId, projectName) => {
                        ui.setProjectId(Number(projectId));
                        ui.setProjectName(projectName);
                        ui.setActiveMenu("board");
                    }}
                    onLogout={onLogout}
                />
            </Header>

            {ui.projectId && (
                <Layout>
                    <Sider
                        collapsible
                        collapsed={ui.siderCollapsed}
                        onCollapse={(v) => ui.setSiderCollapsed(v)}
                        width={200}
                    >
                        <SiderContent
                            projectName={ui.projectName}
                            icon={<FundProjectionScreenOutlined />}
                            collapsed={ui.siderCollapsed}
                            activeKey={ui.activeMenuKey}
                            onMenuSelect={(key) => ui.setActiveMenu(key as any)}
                        />
                    </Sider>

                    <Content style={{ padding: "10px" }}>
                        {ui.activeMenuKey === "members" ? (
                            <MembersPage projectId={projectIdNum} />
                        ) : ui.activeMenuKey === "worklog" ? (
                            <WorklogSection projectId={projectIdNum} />
                        ) : (
                            <IssueBoardIndexPageMobx projectId={projectIdNum} />
                        )}
                    </Content>
                </Layout>
            )}
        </Layout>
    );
});

export default IssueTrackerLayoutMobx;
