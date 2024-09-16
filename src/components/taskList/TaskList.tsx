import { Button } from '../SuperButton';
import { InputTextSender } from '../InputTextSender';
import { Task } from './task/Task';
import { EditableSpan } from '../EditableSpan';
import s from './taskList.module.css';
import { memo, useCallback } from 'react';
import { zip } from '@/utils/zip';

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
    taskListId: string;
    filterValue: FilterType;
    title: string;
    onRemoveTaskList: (taskListId: string) => void;
    filteredTasks: Array<TaskType>;
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
    const { filteredTasks: oldTasks, ...noTasksOld } = oldProps;
    const { filteredTasks: newTasks, ...noTasksNew } = newProps;
    for (const key in noTasksOld) {
        // dunno how to make types for this case tho
        if (!Object.is(noTasksOld[key], noTasksNew[key])) {
            return false;
        }
    }
    // Because I filter tasks in the App, filteredTasks array
    // will always be a new array, if the filter value is not 'all'.
    // Because of that, merely changing a filter value will trigger a new
    // re-render of all TaskList components.
    // So here I check if the array length is the same as in the previous
    // run (no new tasks) && filtered tasks in the array are the same
    // as in the previous run (no modifications).
    // If this is true, and everything else is the same, then I
    // return true, so no new re-render of this component is needed.

    // It is probably better to move filtering tasks logic to the
    // TaskList component, and implement a check if
    // old tasks are the same as new tasks.
    if (oldTasks.length !== newTasks.length) {
        return false;
    }
    for (const [
        { text: oldText, isDone: oldStatus },
        { text: newText, isDone: newStatus },
    ] of zip(oldTasks, newTasks)) {
        if (!(oldText === newText && oldStatus === newStatus)) {
            return false;
        }
    }
    return true;
};

export const TaskList = memo(function TaskList({
    taskListId,
    filterValue,
    title,
    onRemoveTaskList,
    filteredTasks,
    onAddTask,
    onRemoveTask,
    onChangeTaskStatus,
    onUpdateTaskListTitle,
    onUpdateTaskText,
    getButtonIsActive,
    onSetFilterValue,
}: TaskListPropsType) {
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
