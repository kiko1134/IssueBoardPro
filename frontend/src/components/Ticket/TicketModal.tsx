import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export interface Issue {
  id: number;
  title: string;
  description: string;
  // type: string;
  // priority: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  issue: Issue | null;
  onSave: (updatedIssue: Issue) => void;
}

const TicketModal: React.FC<Props> = ({ open, onClose, issue, onSave }) => {
  const [form] = Form.useForm();

  if (!issue) return null;

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({ ...issue, ...values });
        onClose();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
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
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Type is required" }]}
        >
          <Select placeholder="Select issue type">
            <Option value="bug">Bug</Option>
            <Option value="feature">Feature</Option>
            <Option value="task">Task</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Priority is required" }]}
        >
          <Select placeholder="Select priority">
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TicketModal;  