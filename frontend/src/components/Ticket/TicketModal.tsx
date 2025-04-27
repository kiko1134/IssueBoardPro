import React, {useEffect} from "react";
import {Button, Form, Input, message, Modal, Select} from "antd";
import {Task as TaskModel, updateTask} from '../../api/taskService';


const {TextArea} = Input;
const {Option} = Select;

interface Props {
    open: boolean;
    onClose: () => void;
    issue: TaskModel | null;
    onSave: (updatedIssue: TaskModel) => void;
}

const TicketModal: React.FC<Props> = ({open, onClose, issue, onSave}) => {
    const [form] = Form.useForm<TaskModel>();

    // Populate form fields when an issue is selected
    useEffect(() => {
        if (issue) {
            form.setFieldsValue({
                title: issue.title,
                description: issue.description,
                type: issue.type,
                priority: issue.priority,
            });
        }
    }, [issue, form]);

    if (!issue) return null;

    const handleOk = async() => {
        try{
            const values = await form.validateFields();
            const updated = await updateTask(issue.id, {
                title: values.title,
                description: values.description,
                type: values.type,
                priority: values.priority,
            });
            message.success('Ticket updated successfully');
            onSave(updated);
            onClose();
        } catch (error) {
            console.log(error);
            message.error('Failed to update ticket');
        }
    };

    return (
        <Modal
            title={`Issue #${issue.id}`}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Save
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={issue}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{required: true, message: "Title is required"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{required: true, message: "Description is required"}]}
                >
                    <TextArea rows={4}/>
                </Form.Item>

                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{required: true, message: "Type is required"}]}
                >
                    <Select placeholder="Select issue type">
                        <Option value="Bug">Bug</Option>
                        <Option value="Feature">Feature</Option>
                        <Option value="Task">Task</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Priority"
                    name="priority"
                    rules={[{required: true, message: "Priority is required"}]}
                >
                    <Select placeholder="Select priority">
                        <Option value="Low">Low</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="High">High</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TicketModal;  