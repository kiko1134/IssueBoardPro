import {Avatar, Button, Dropdown, Form, Input, MenuProps, message, Modal, Popconfirm} from "antd";
import {DownOutlined, PlusOutlined,LogoutOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {createProject, fetchProjects, Project} from "../../api/services/projectService";
import {jwtDecode} from "jwt-decode";
import { AVATAR_COLORS } from "../issueBoard/IssueBoardFilterActions";

interface HeaderContentProps {
    onProjectSelect: (projectId: string, projectName: string) => void;
    onLogout: () => void;
}


const HeaderContent: React.FC<HeaderContentProps> = ({onProjectSelect, onLogout}) => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
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
        } catch (err: any) {
            message.error('Failed to load projects');
        }
    };

    const items: MenuProps['items'] = projects.map(p => ({
        key: p.id.toString(),
        label: p.name,
    }));

    const menuProps: MenuProps = {
        items,
        selectedKeys: [selectedProjectId],
        onClick: ({key}) => {
            const projectId = key as string;
            const proj = projects.find(p => p.id.toString() === projectId);
            if (proj) {
                setSelectedProjectId(projectId);
                onProjectSelect(projectId, proj.name);
            }
        }
    };

    const handleMenuClick = ({key}: { key: string }) => {
        if (key === 'logout') {
            setShowLogoutConfirm(true);
        }
    };

    const profileMenuProps: MenuProps = {
        items: [
            {
                key: 'user-info',
                label: (
                    <div style={{ padding: '8px 12px', pointerEvents: 'none' }}>
                        <div style={{ fontWeight: 'bold' }}>{username}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{email}</div>
                    </div>
                ),
            },
            // { type: 'divider' },
            // { key: 'profile', label: 'My Profile', icon: <UserOutlined /> },
            // { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
            { type: 'divider' },
            { key: 'logout', label: 'Logout', icon: <LogoutOutlined /> },
        ],
        onClick: handleMenuClick,
    };

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleCreateProject = async () => {
        try {
            const values = await form.validateFields();
            const newProj = await createProject(values);
            message.success(`Project "${newProj.name}" created`);
            closeModal();
            await loadProjects();
            const idStr = newProj.id.toString();
            setSelectedProjectId(idStr);
            onProjectSelect(idStr, newProj.name);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to create project');
        }
    };

    const selectedLabel = projects.find(p => p.id.toString() === selectedProjectId)?.name;

    return (
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <div style={{fontSize: '20px', fontWeight: 'bold', marginRight: '16px'}}>
                Issue Tracker
            </div>

            <Dropdown menu={menuProps} trigger={['click']}>
                <Button type="text" style={{marginRight: 16}}>
                    {selectedLabel || 'Select Project'} <DownOutlined/>
                </Button>
            </Dropdown>

            <Button
                type="primary"
                icon={<PlusOutlined/>}
                style={{marginRight: '16px'}}
                onClick={openModal}
            >
                Create Project
            </Button>

            {showLogoutConfirm ? (
                <Popconfirm
                    title="Are you sure you want to logout?"
                    onConfirm={() => {
                        setShowLogoutConfirm(false);
                        onLogout();
                    }}
                    onCancel={() => setShowLogoutConfirm(false)}
                    okText="Yes"
                    cancelText="No"
                    open={true}
                >
                    <Avatar style={{ marginLeft: 'auto', backgroundColor: AVATAR_COLORS[id % AVATAR_COLORS.length], cursor: 'pointer' }}>
                        {firstLetter}
                    </Avatar>
                </Popconfirm>
            ) : (
                <Dropdown menu={profileMenuProps} trigger={['click']}>
                    <Avatar style={{ marginLeft: 'auto', backgroundColor: AVATAR_COLORS[id % AVATAR_COLORS.length], cursor: 'pointer' }}>
                        {firstLetter}
                    </Avatar>
                </Dropdown>
            )}

            <Modal
                title="Create New Project"
                open={isModalVisible}
                onCancel={closeModal}
                onOk={handleCreateProject}
                okText="Create"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{required: true, message: 'Please enter a project name'}]}
                    >
                        <Input placeholder="My Project"/>
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Describe your project" rows={3}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default HeaderContent;