import {Button, Dropdown, Form, Input, MenuProps, message, Modal} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {createProject, fetchProjects, Project} from "../../api/projectService";

// const menuItems = [
//     {label: "First Project Firm LOng LOng title", key: "1"},
//     {label: "Project 2", key: "2"},
//     {label: "Project 3", key: "3"},
// ];

interface HeaderContentProps {
    onProjectSelect: (projectName: string) => void;
}


const HeaderContent: React.FC<HeaderContentProps> = ({onProjectSelect}) => {

    // const handleMenuClick = (info: any) => {
    //     const selected = menuItems.find(item => item.key === info.key);
    //     if (selected) {
    //         onProjectSelect(selected.label);
    //     }
    // };
    //
    // return (
    //     <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
    //         <div
    //             style={{
    //                 fontSize: '20px',
    //                 fontWeight: 'bold',
    //                 marginRight: '16px'
    //             }}
    //         >
    //             Issue Tracker
    //         </div>
    //
    //         <Dropdown menu={{items: menuItems, onClick: handleMenuClick}} trigger={["click"]}>
    //             <Button type="text" style={{marginRight: "16px"}}>
    //                 Projects <DownOutlined/>
    //             </Button>
    //         </Dropdown>
    //
    //         <Button
    //             type="primary"
    //             icon={<PlusOutlined/>}
    //             style={{marginRight: '16px'}}
    //         >
    //             Create Project
    //         </Button>
    //         <Button style={{marginLeft: 'auto'}}>CV</Button>
    //     </div>

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

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
        key: p.name,
        label: p.name,
    }));

    const menuProps: MenuProps = {
        items,
        selectedKeys: [selectedProject],
        onClick: ({ key }) => {
            setSelectedProject(key as string);
            onProjectSelect(key as string);
        }
    };

    // const handleMenuClick = ({ key }: { key: string }) => {
    //     setSelectedProject(key);
    //     onProjectSelect(key);
    // };

    // const menu = (
    //     <Menu onClick={handleMenuClick} selectedKeys={[selectedProject]}>
    //         {projects.map((p) => (
    //             <Menu.Item key={p.name}>{p.name}</Menu.Item>
    //         ))}
    //     </Menu>
    // );

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
            setSelectedProject(newProj.name);
            onProjectSelect(newProj.name);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to create project');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '16px' }}>
                Issue Tracker
            </div>

            <Dropdown menu={menuProps} trigger={['click']}>
                <Button type="text" style={{ marginRight: 16 }}>
                    {selectedProject || 'Select Project'} <DownOutlined />
                </Button>
            </Dropdown>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginRight: '16px' }}
                onClick={openModal}
            >
                Create Project
            </Button>

            <Button style={{ marginLeft: 'auto' }}>CV</Button>

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
                        rules={[{ required: true, message: 'Please enter a project name' }]}
                    >
                        <Input placeholder="My Project" />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Describe your project" rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default HeaderContent;