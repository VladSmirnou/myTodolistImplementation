import { Button } from '../SuperButton';
import { InputTextSender } from '../InputTextSender';
import { Task } from './task/Task';
import { EditableSpan } from '../EditableSpan';
import s from './taskList.module.css';

export const ALL_BUTTON_NAME = 'All';
export const ACTIVE_BUTTON_NAME = 'Active';
export const COMPLETED_BUTTON_NAME = 'Completed';

export type ButtonNameType =
    | typeof ALL_BUTTON_NAME
    | typeof ACTIVE_BUTTON_NAME
    | typeof COMPLETED_BUTTON_NAME;

export type TaskType = {
    id: number;
    text: string;
    isDone: boolean;
};

type TaskListPropsType = {
    title: string;
    removeTaskList: () => void;
    filteredTasks: Array<TaskType>;
    addTask: (taskTitle: string) => void;
    removeTask: (taskId: number) => void;
    changeTaskStatus: (taskId: number, newStatus: boolean) => void;
    updateTaskListTitle: (newTitle: string) => void;
    updateTaskText: (taskId: number, newText: string) => void;
    getButtonIsActive: (buttonName: ButtonNameType) => boolean;
    setFilterValue: (buttonName: ButtonNameType) => void;
};

export const TaskList = (props: TaskListPropsType) => {
    const changeTaskStatusWrapper = (taskId: number) => {
        return (newStatus: boolean) => {
            props.changeTaskStatus(taskId, newStatus);
        };
    };

    const updateTaskTextWrapper = (taskId: number) => {
        return (newText: string) => {
            props.updateTaskText(taskId, newText);
        };
    };

    const tasksOrNoTasksText =
        props.filteredTasks.length ?
            <ul>
                {props.filteredTasks.map((t) => (
                    <Task
                        key={t.id}
                        isDone={t.isDone}
                        text={t.text}
                        removeTask={() => props.removeTask(t.id)}
                        changeTaskStatus={changeTaskStatusWrapper(t.id)}
                        updateTaskText={updateTaskTextWrapper(t.id)}
                    />
                ))}
            </ul>
        :   <p>thid tasklist doesnt have any tasks</p>;

    return (
        <div>
            <div>
                <h2>
                    <EditableSpan callBack={props.updateTaskListTitle}>
                        {props.title}
                    </EditableSpan>
                </h2>
                <Button onClick={props.removeTaskList}>X</Button>
            </div>
            <InputTextSender callBack={props.addTask} />
            {tasksOrNoTasksText}
            <Button
                className={
                    props.getButtonIsActive(ALL_BUTTON_NAME) ? s.active : ''
                }
                onClick={() => props.setFilterValue(ALL_BUTTON_NAME)}
            >
                {ALL_BUTTON_NAME}
            </Button>
            <Button
                className={
                    props.getButtonIsActive(ACTIVE_BUTTON_NAME) ? s.active : ''
                }
                onClick={() => props.setFilterValue(ACTIVE_BUTTON_NAME)}
            >
                {ACTIVE_BUTTON_NAME}
            </Button>
            <Button
                className={
                    props.getButtonIsActive(COMPLETED_BUTTON_NAME) ?
                        s.active
                    :   ''
                }
                onClick={() => props.setFilterValue(COMPLETED_BUTTON_NAME)}
            >
                {COMPLETED_BUTTON_NAME}
            </Button>
        </div>
    );
};
