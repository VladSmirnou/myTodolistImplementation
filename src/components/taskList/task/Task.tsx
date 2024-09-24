import { EditableSpan } from '@/components/EditableSpan';
import { Button } from '@/components/SuperButton';
import { ChangeEvent, memo } from 'react';
import { TaskType } from '../TaskList';

type TaskPropsType = {
    task: TaskType;
    onRemoveTask: (taskId: number) => void;
    onChangeTaskStatus: (taskId: number, newStatus: boolean) => void;
    onUpdateTaskText: (taskId: number, newText: string) => void;
};

export const Task = memo(function Task(props: TaskPropsType) {
    const handleChangeTaskStatus = ({
        currentTarget: { checked },
    }: ChangeEvent<HTMLInputElement>) => {
        props.onChangeTaskStatus(props.task.id, checked);
    };

    const handleRemoveTask = () => {
        props.onRemoveTask(props.task.id);
    };

    const handleUpdateTaskText = (newText: string) => {
        props.onUpdateTaskText(props.task.id, newText);
    };

    return (
        <li>
            <input
                type="checkbox"
                checked={props.task.isDone}
                onChange={handleChangeTaskStatus}
            />
            <EditableSpan callBack={handleUpdateTaskText}>
                {props.task.text}
            </EditableSpan>
            <Button onClick={handleRemoveTask}>X</Button>
        </li>
    );
});
