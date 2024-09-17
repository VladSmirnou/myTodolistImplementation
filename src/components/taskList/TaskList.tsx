import { Button } from '../SuperButton';
import { InputTextSender } from '../InputTextSender';
import { Task } from './task/Task';
import { EditableSpan } from '../EditableSpan';
import s from './taskList.module.css';
import { memo, useCallback } from 'react';

export type TasksType = {
    [key: string]: Array<TaskType>;
};

export type FilterType = 'all' | 'active' | 'completed';

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
    filterTasksFn: (
        tasks: Array<TaskType>,
        filter: FilterType,
    ) => Array<TaskType>;
    tasks: TasksType;
    taskListId: string;
    filterValue: FilterType;
    title: string;
    onRemoveTaskList: (taskListId: string) => void;
    onAddTask: (taskListId: string, taskTitle: string) => void;
    onRemoveTask: (taskListId: string, taskId: number) => void;
    onChangeTaskStatus: (
        taskListId: string,
        taskId: number,
        newStatus: boolean,
    ) => void;
    onUpdateTaskListTitle: (taskListId: string, newTitle: string) => void;
    onUpdateTaskText: (
        taskListId: string,
        taskId: number,
        newText: string,
    ) => void;
    getButtonIsActive: (
        buttonName: ButtonNameType,
        currentFilterValue: FilterType,
    ) => boolean;
    onSetFilterValue: (taskListId: string, buttonName: ButtonNameType) => void;
};

const arePropsEqual = (
    oldProps: TaskListPropsType,
    newProps: TaskListPropsType,
) => {
    const {
        tasks: { [oldProps.taskListId]: oldTasks },
        ...oldRestProps
    } = oldProps;

    const {
        tasks: { [oldProps.taskListId]: newTasks },
        ...newRestProps
    } = newProps;
    // task list can be removed | task list can be added.
    // If old and new task arrays are the same, it means that there is no
    // new tasks or existing tasks weren't updated.
    if (!(oldTasks && newTasks && oldTasks === newTasks)) {
        return false;
    }

    for (const key in oldRestProps) {
        // dunno how to make types for this case tho
        if (!Object.is(oldRestProps[key], newRestProps[key])) {
            return false;
        }
    }
    return true;
};

export const TaskList = memo(function TaskList({
    tasks,
    filterTasksFn,
    taskListId,
    filterValue,
    title,
    onRemoveTaskList,
    onAddTask,
    onRemoveTask,
    onChangeTaskStatus,
    onUpdateTaskListTitle,
    onUpdateTaskText,
    getButtonIsActive,
    onSetFilterValue,
}: TaskListPropsType) {
    const filteredTasks = filterTasksFn(tasks[taskListId], filterValue);

    const handleAddTask = (taskText: string) => {
        onAddTask(taskListId, taskText);
    };

    const handleUpdateTaskText = useCallback(
        (taskId: number, newText: string) => {
            onUpdateTaskText(taskListId, taskId, newText);
        },
        [taskListId, onUpdateTaskText],
    );

    const handleChangeTaskStatus = useCallback(
        (taskId: number, newStatus: boolean) => {
            onChangeTaskStatus(taskListId, taskId, newStatus);
        },
        [taskListId, onChangeTaskStatus],
    );

    const handleRemoveTask = useCallback(
        (taskId: number) => {
            onRemoveTask(taskListId, taskId);
        },
        [taskListId, onRemoveTask],
    );

    const handleUpdateTaskListTitle = (newTitle: string) => {
        onUpdateTaskListTitle(taskListId, newTitle);
    };

    const handleRemoveTaskList = () => {
        onRemoveTaskList(taskListId);
    };

    const handleSetFilterValue = (buttonName: ButtonNameType) => {
        onSetFilterValue(taskListId, buttonName);
    };

    const tasksOrNoTasksText =
        filteredTasks.length ?
            <ul>
                {filteredTasks.map((t) => (
                    <Task
                        key={t.id}
                        taskId={t.id}
                        isDone={t.isDone}
                        text={t.text}
                        onRemoveTask={handleRemoveTask}
                        onChangeTaskStatus={handleChangeTaskStatus}
                        onUpdateTaskText={handleUpdateTaskText}
                    />
                ))}
            </ul>
        :   <p>thid tasklist doesnt have any tasks</p>;

    return (
        <div>
            <div>
                <h2>
                    <EditableSpan callBack={handleUpdateTaskListTitle}>
                        {title}
                    </EditableSpan>
                </h2>
                <Button onClick={handleRemoveTaskList}>X</Button>
            </div>
            <InputTextSender callBack={handleAddTask} />
            {tasksOrNoTasksText}
            <Button
                className={
                    getButtonIsActive(ALL_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={() => handleSetFilterValue(ALL_BUTTON_NAME)}
            >
                {ALL_BUTTON_NAME}
            </Button>
            <Button
                className={
                    getButtonIsActive(ACTIVE_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={() => handleSetFilterValue(ACTIVE_BUTTON_NAME)}
            >
                {ACTIVE_BUTTON_NAME}
            </Button>
            <Button
                className={
                    getButtonIsActive(COMPLETED_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={() => handleSetFilterValue(COMPLETED_BUTTON_NAME)}
            >
                {COMPLETED_BUTTON_NAME}
            </Button>
        </div>
    );
}, arePropsEqual);
