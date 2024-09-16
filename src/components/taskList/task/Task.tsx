import { EditableSpan } from '@/components/EditableSpan';
import { Button } from '@/components/SuperButton';
import { ChangeEvent, memo } from 'react';

type TaskPropsType = {
    taskId: number;
    isDone: boolean;
    text: string;
    onRemoveTask: (taskId: number) => void;
    onChangeTaskStatus: (taskId: number, newStatus: boolean) => void;
    onUpdateTaskText: (taskId: number, newText: string) => void;
};

export const Task = memo(function Task(props: TaskPropsType) {
    const handleChangeTaskStatus = ({
        currentTarget: { checked },
    }: ChangeEvent<HTMLInputElement>) => {
        props.onChangeTaskStatus(props.taskId, checked);
    };

    const handleRemoveTask = () => {
        props.onRemoveTask(props.taskId);
    };

    const handleUpdateTaskText = (newText: string) => {
        props.onUpdateTaskText(props.taskId, newText);
    };

    return (
        <li>
            <input
                type="checkbox"
                checked={props.isDone}
                onChange={handleChangeTaskStatus}
            />
            <EditableSpan callBack={handleUpdateTaskText}>
                {props.text}
            </EditableSpan>
            <Button onClick={handleRemoveTask}>X</Button>
        </li>
    );
});
