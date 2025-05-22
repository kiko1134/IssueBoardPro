import {Avatar, Button, Dropdown, Form, Input, MenuProps, message, Modal, Popconfirm, Tooltip, Typography} from "antd";
import {DeleteOutlined, DownOutlined, EditOutlined, LogoutOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {
    createProject,
    deleteProject,
    fetchProjects,
    ProjectDetails,
    updateProject
} from "../../api/services/projectService";
import {jwtDecode} from "jwt-decode";
import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";

interface HeaderContentProps {
    onProjectSelect: (projectId: string, projectName: string) => void;
    onLogout: () => void;
}


const HeaderContent: React.FC<HeaderContentProps> = ({onProjectSelect, onLogout}) => {

    const [projects, setProjects] = useState<ProjectDetails[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectDetails | null>(null);
    const [form] = Form.useForm();
    const [profileOpen, setProfileOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    let username = 'User';
    let email = 'user@example.com';
    let id = 0;

    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode<any>(token);
            if (decoded.username) username = decoded.username;
            if (decoded.email) email = decoded.email;
            if (decoded.id) id = decoded.id;
        } catch (err) {
            console.warn('Invalid token');
        }
    }

    const firstLetter = username.charAt(0).toUpperCase();


    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch (err) {
            message.error('Failed to load projects');
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    // Handlers
    const handleSelect = (key: string) => {
        const proj = projects.find(p => p.id.toString() === key);
        if (proj) {
            setSelectedProjectId(key);
            onProjectSelect(key, proj.name);
        }
    };

    const openCreate = () => {
        form.resetFields();
        setCreateModalVisible(true);
    };
    const openEdit = (proj: ProjectDetails) => {
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
            const newProj = await createProject(vals);
            message.success(`Project "${newProj.name}" created`);
            closeModals();
            loadProjects();
            const idStr = newProj.id.toString();
            setSelectedProjectId(idStr);
            onProjectSelect(idStr, newProj.name);
        } catch (e: any) {
            message.error(e.response?.data?.message || 'Failed to create project');
        }
    };

    const handleEditSave = async () => {
        if (!editingProject) return;
        try {
            const vals = await form.validateFields();
            const updated = await updateProject(editingProject.id, vals);
            message.success(`Project "${updated.name}" updated`);
            closeModals();
            loadProjects();
            const idStr = updated.id.toString();
            setSelectedProjectId(idStr);
            onProjectSelect(idStr, updated.name);
        } catch (e: any) {
            message.error(e.response?.data?.message || 'Failed to update project');
        }
    };

    const handleDelete = async (proj: ProjectDetails) => {
        try {
            await deleteProject(proj.id);
            message.success(`Project "${proj.name}" deleted`);
            loadProjects();
            if (selectedProjectId === proj.id.toString()) {
                setSelectedProjectId('');
                onProjectSelect('', '');
            }
        } catch {
            message.error('Failed to delete project');
        }
    };

    const menuItems: MenuProps['items'] = projects.map(proj => ({
        key: proj.id.toString(),
        label: (
            <div
                style={{
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Typography.Text ellipsis style={{margin: 0}}>
                    {proj.name}
                </Typography.Text>

                {proj.adminId === id && (
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Tooltip title="Edit Project">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined/>}
                                onClick={e => {
                                    e.stopPropagation();
                                    openEdit(proj);
                                }}
                                style={{padding: 0}}
                            />
                        </Tooltip>
                        <Popconfirm
                            title="Delete this project?"
                            onConfirm={() => handleDelete(proj)}
                            onCancel={e => e?.stopPropagation()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined/>}
                                onClick={e => e.stopPropagation()}
                                style={{padding: 0}}
                                danger
                            />
                        </Popconfirm>
                    </div>
                )}
            </div>
        ),
    }));

    // Profile menu
    const profileMenu: MenuProps = {
        items: [
            {
                key: 'info',
                label: (
                    <div style={{padding: 8, pointerEvents: 'none'}}><strong>{username}</strong><br/><Typography.Text
                        type="secondary">{email}</Typography.Text></div>)
            },
            {type: 'divider'},
            {key: 'logout', label: 'Logout', icon: <LogoutOutlined/>}
        ],
        onClick: ({key, domEvent},) => {
            if (key === 'logout') {
                // prevent the dropdown from auto-closing
                domEvent.preventDefault();
                domEvent.stopPropagation();
                setShowLogoutConfirm(true);
            }
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <div style={{fontSize: 20, fontWeight: 'bold', marginRight: 16}}>Issue Tracker</div>

            <Dropdown
                menu={{items: menuItems, selectedKeys: [selectedProjectId], onClick: ({key}) => handleSelect(key)}}
                trigger={['click']}>
                <Button type="text" style={{marginRight: 16}}>
                    {projects.find(p => p.id.toString() === selectedProjectId)?.name || 'Select Project'}
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

            {/* Create Modal */}
            <Modal title="Create New Project" open={createModalVisible} onCancel={closeModals} onOk={handleCreate}
                   okText="Create">
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Project Name"
                               rules={[{required: true, message: 'Enter a project name'}]}><Input/></Form.Item>
                    <Form.Item name="description" label="Description"><Input.TextArea rows={3}/></Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal title="Edit Project" open={editModalVisible} onCancel={closeModals} onOk={handleEditSave}
                   okText="Save">
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Project Name"
                               rules={[{required: true, message: 'Enter a project name'}]}><Input/></Form.Item>
                    <Form.Item name="description" label="Description"><Input.TextArea rows={3}/></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default HeaderContent;