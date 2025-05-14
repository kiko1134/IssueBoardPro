import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { Task as TaskModel, updateTask, updateTaskWorkLog } from "../../api/services/issueService";
import { fetchProjectMembers } from "../../api/services/projectService";
import { User } from "../../api/services/userService";

const { TextArea } = Input;
const { Option } = Select;

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  issue: TaskModel | null;
  onSave: (updatedIssue: TaskModel) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ open, onClose, issue, onSave }) => {
  const [form] = Form.useForm<TaskModel>();
  const [users, setUsers] = React.useState<User[]>([]);

  const [workLogMinutes, setWorkLogMinutes] = React.useState<number>(
    issue?.workLog ?? 0
  );
  const [newHours, setNewHours] = React.useState<number>(0);
  const [newMinutes, setNewMinutes] = React.useState<number>(0);

  useEffect(() => {
    if (!issue) return;
    fetchProjectMembers(issue.projectId)
      .then(setUsers)
      .catch(() => message.error("Failed to load users"));
  }, [issue]);

  useEffect(() => {
    form.resetFields();
    if (issue) {
      form.setFieldsValue({
        title: issue.title,
        description: issue.description,
        type: issue.type,
        priority: issue.priority,
        assignedTo: issue.assignedTo,
        assignedBy: issue.assignedBy,
      });
      setWorkLogMinutes(issue.workLog ?? 0);
      setNewHours(0);
      setNewMinutes(0);
    }
  }, [issue, form]);

  if (!issue) return null;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      await updateTask(issue.id, {
        title:       values.title,
        description: values.description,
        type:        values.type,
        priority:    values.priority,
        assignedTo:  values.assignedTo,
        assignedBy:  values.assignedBy,
      });
      const updated = await updateTaskWorkLog(issue.id, workLogMinutes);

      message.success("Ticket updated successfully");
      onSave(updated);
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to update ticket");
    }
  };

  const handleAddWorkLog = async () => {
    const added = newHours * 60 + newMinutes;
    const newTotal = workLogMinutes + added;

    console.log("issue", issue);

    try {
      const updated = await updateTaskWorkLog(issue.id, newTotal);
      setWorkLogMinutes(updated.workLog);
      setNewHours(0);
      setNewMinutes(0);
      message.success("Worklog updated");
    } catch (err) {
      console.error(err);
      message.error("Failed to update worklog");
    }
  };

  const displayHours = Math.floor(workLogMinutes / 60);
  const displayMinutes = workLogMinutes % 60;

  return (
    <Modal
      title={`Issue #${issue.id}`}
      open={open}
      onCancel={onClose}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
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
            <Option value="Bug">Bug</Option>
            <Option value="Feature">Feature</Option>
            <Option value="Task">Task</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Priority is required" }]}
        >
          <Select placeholder="Select priority">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Assigned To"
          name="assignedTo"
          rules={[{ required: true, message: "Assignee is required" }]}
        >
          <Select placeholder="Select assignee">
            {users.map((u) => (
              <Option key={u.id} value={u.id}>
                {u.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Assigned By"
          name="assignedBy"
          rules={[{ required: true, message: "Reporter is required" }]}
        >
          <Select placeholder="Select reporter">
            {users.map((u) => (
              <Option key={u.id} value={u.id}>
                {u.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Worklog">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <InputNumber
              min={0}
              value={newHours}
              onChange={(v) => setNewHours(v ?? 0)}
              style={{ width: 80 }}
              placeholder="h"
            />
            <span>h</span>
            <InputNumber
              min={0}
              max={59}
              value={newMinutes}
              onChange={(v) => setNewMinutes(v ?? 0)}
              style={{ width: 80 }}
              placeholder="min"
            />
            <span>min</span>
            <Button
              type="primary"
              onClick={handleAddWorkLog}
            >
              OK
            </Button>
            <span>
              Current: {displayHours} h {displayMinutes} min
            </span>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TicketModal;
