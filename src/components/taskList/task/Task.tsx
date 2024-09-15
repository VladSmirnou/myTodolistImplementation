import { EditableSpan } from '@/components/EditableSpan';
import { Button } from '@/components/SuperButton';
import { ChangeEvent, memo } from 'react';

type TaskPropsType = {
    taskId: number;
    isDone: boolean;
    text: string;
    removeTask: (taskId: number) => void;
    changeTaskStatus: (taskId: number, newStatus: boolean) => void;
    updateTaskText: (taskId: number, newText: string) => void;
};

export const Task = memo(function Task(props: TaskPropsType) {
    const changeTaskStatus = ({
        currentTarget: { checked },
    }: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.taskId, checked);
    };

    const removeTask = () => {
        props.removeTask(props.taskId);
    };

    const updateTaskText = (newText: string) => {
        props.updateTaskText(props.taskId, newText);
    };

    return (
        <li>
            <input
                type="checkbox"
                checked={props.isDone}
                onChange={changeTaskStatus}
            />
            <EditableSpan callBack={updateTaskText}>{props.text}</EditableSpan>
            <Button onClick={removeTask}>X</Button>
        </li>
    );
});
