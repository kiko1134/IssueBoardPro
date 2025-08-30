import {Avatar, Button, Dropdown, Form, Input, MenuProps, message, Modal, Popconfirm, Tooltip, Typography} from "antd";
import {DeleteOutlined, DownOutlined, EditOutlined, LogoutOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";
import {observer} from "mobx-react-lite";
import {useProjects, useUI, useUser} from "../../stores/rootStore";

interface HeaderContentProps {
    onProjectSelect: (projectId: string, projectName: string) => void;
    onLogout: () => void;
}

const HeaderContentMobx: React.FC<HeaderContentProps> = observer(({onProjectSelect, onLogout}) => {
    const user = useUser();
    const projects = useProjects();
    const ui = useUI();

    const username = user.user?.username ?? "User";
    const email = user.user?.email ?? "user@example.com";
    const id = Number(user.user?.id) || 0;
    const firstLetter = username.charAt(0).toUpperCase();

    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [form] = Form.useForm();
    const [profileOpen, setProfileOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        projects.fetchAll().catch(() => message.error("Failed to load projects"));
    }, [projects]);

    const handleSelect = (key: string) => {
        const proj = projects.items.find((p) => p.id.toString() === key);
        if (proj) {
            setSelectedProjectId(key);
            ui.setProjectId(proj.id);
            ui.setProjectName(proj.name);
            ui.setActiveMenu("board");
            onProjectSelect(key, proj.name);
        }
    };

    const openCreate = () => {
        form.resetFields();
        setCreateModalVisible(true);
    };
    const openEdit = (proj: any) => {
        setEditingProject(proj);
        form.setFieldsValue({name: proj.name, description: proj.description});
        setEditModalVisible(true);
    };
    const closeModals = () => {
        setCreateModalVisible(false);
        setEditModalVisible(false);
        form.resetFields();
    };

    const handleCreate = async () => {
        try {
            const vals = await form.validateFields();
            const newProj = await projects.create(vals);
            message.success(`Project "${newProj.name}" created`);
            closeModals();
            const idStr = newProj.id.toString();
            setSelectedProjectId(idStr);
            handleSelect(idStr);
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Failed to create project");
        }
    };

    const handleEditSave = async () => {
        if (!editingProject) return;
        try {
            const vals = await form.validateFields();
            const updated = await projects.update(editingProject.id, vals);
            message.success(`Project "${updated.name}" updated`);
            closeModals();
            const idStr = updated.id.toString();
            setSelectedProjectId(idStr);
            handleSelect(idStr);
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Failed to update project");
        }
    };

    const handleDelete = async (proj: any) => {
        try {
            await projects.remove(proj.id);
            message.success(`Project "${proj.name}" deleted`);
            if (selectedProjectId === proj.id.toString()) {
                setSelectedProjectId("");
                ui.setProjectId(null);
                ui.setProjectName("");
            }
        } catch {
            message.error("Failed to delete project");
        }
    };

    const menuItems: MenuProps["items"] = projects.items.map((proj) => ({
        key: proj.id.toString(),
        label: (
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                <Typography.Text ellipsis style={{margin: 0}}>{proj.name}</Typography.Text>
                {proj.adminId === id && (
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Tooltip title="Edit Project">
                            <Button type="text" size="small" icon={<EditOutlined/>} onClick={(e) => {
                                e.stopPropagation();
                                openEdit(proj);
                            }} style={{padding: 0}}/>
                        </Tooltip>
                        <Popconfirm
                            title="Delete this project?"
                            onConfirm={() => handleDelete(proj)}
                            onCancel={(e) => e?.stopPropagation()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="text" size="small" icon={<DeleteOutlined/>}
                                    onClick={(e) => e.stopPropagation()} style={{padding: 0}} danger/>
                        </Popconfirm>
                    </div>
                )}
            </div>
        ),
    }));

    const profileMenu: MenuProps = {
        items: [
            {
                key: "info",
                label: (
                    <div style={{padding: 8, pointerEvents: "none"}}><strong>{username}</strong><br/><Typography.Text
                        type="secondary">{email}</Typography.Text></div>)
            },
            {type: "divider"},
            {key: "logout", label: "Logout", icon: <LogoutOutlined/>}
        ],
        onClick: ({key, domEvent}) => {
            if (key === "logout") {
                domEvent.preventDefault();
                domEvent.stopPropagation();
                setShowLogoutConfirm(true);
            }
        },
    };

    return (
        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
            <div style={{fontSize: 20, fontWeight: "bold", marginRight: 16}}>Issue Tracker</div>

            <Dropdown
                menu={{items: menuItems, selectedKeys: [selectedProjectId], onClick: ({key}) => handleSelect(key)}}
                trigger={['click']}>
                <Button type="text" style={{marginRight: 16}}>
                    {projects.items.find(p => p.id.toString() === selectedProjectId)?.name || 'Select Project'}
                    <DownOutlined/>
                </Button>
            </Dropdown>

            <Button icon={<PlusOutlined/>} type="primary" style={{marginRight: 16}} onClick={openCreate}>Create
                Project
            </Button>


            <Dropdown
                menu={profileMenu}
                open={profileOpen}
                onOpenChange={(open) => {
                    // don't close if logout confirm is showing
                    if (!showLogoutConfirm) setProfileOpen(open);
                }}
                trigger={['click']}
            >
                <Popconfirm
                    title="Are you sure you want to logout?"
                    open={showLogoutConfirm}
                    onConfirm={() => {
                        setShowLogoutConfirm(false);
                        setProfileOpen(false);
                        onLogout();
                    }}
                    onCancel={() => {
                        setShowLogoutConfirm(false);
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Avatar
                        onClick={(e: any) => {
                            e.stopPropagation();
                            setProfileOpen((prev) => !prev);
                        }}
                        style={{
                            marginLeft: 'auto',
                            backgroundColor: AVATAR_COLORS[id % AVATAR_COLORS.length],
                            cursor: 'pointer',
                        }}
                    >
                        {firstLetter}
                    </Avatar>
                </Popconfirm>
            </Dropdown>

            <Modal title="Create New Project" open={createModalVisible} onCancel={closeModals} onOk={handleCreate}
                   okText="Create">
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Project Name"
                               rules={[{required: true, message: "Enter a project name"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="description" label="Description"><Input.TextArea rows={3}/></Form.Item>
                </Form>
            </Modal>

            <Modal title="Edit Project" open={editModalVisible} onCancel={closeModals} onOk={handleEditSave}
                   okText="Save">
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Project Name"
                               rules={[{required: true, message: "Enter a project name"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="description" label="Description"><Input.TextArea rows={3}/></Form.Item>
                </Form>
            </Modal>
        </div>
    );
});

export default HeaderContentMobx;
