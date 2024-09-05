import { EditableSpan } from '@/components/EditableSpan';
import { Button } from '@/components/SuperButton';
import { ChangeEvent } from 'react';

type TaskPropsType = {
    isDone: boolean;
    text: string;
    removeTask: () => void;
    changeTaskStatus: (newStatus: boolean) => void;
    updateTaskText: (newText: string) => void;
};

export const Task = (props: TaskPropsType) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        props.changeTaskStatus(e.currentTarget.checked);
    return (
        <li>
            <input
                type="checkbox"
                checked={props.isDone}
                onChange={handleChange}
            />
            <EditableSpan callBack={props.updateTaskText}>
                {props.text}
            </EditableSpan>
            <Button onClick={props.removeTask}>X</Button>
        </li>
    );
};
