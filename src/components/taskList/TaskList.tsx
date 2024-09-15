import { Button } from '../SuperButton';
import { InputTextSender } from '../InputTextSender';
import { Task } from './task/Task';
import { EditableSpan } from '../EditableSpan';
import s from './taskList.module.css';
import { memo, useCallback } from 'react';

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
    removeTaskList: (taskListId: string) => void;
    filteredTasks: Array<TaskType>;
    addTask: (taskListId: string, taskTitle: string) => void;
    removeTask: (taskListId: string, taskId: number) => void;
    changeTaskStatus: (
        taskListId: string,
        taskId: number,
        newStatus: boolean,
    ) => void;
    updateTaskListTitle: (taskListId: string, newTitle: string) => void;
    updateTaskText: (
        taskListId: string,
        taskId: number,
        newText: string,
    ) => void;
    getButtonIsActive: (
        buttonName: ButtonNameType,
        currentFilterValue: FilterType,
    ) => boolean;
    setFilterValue: (taskListId: string, buttonName: ButtonNameType) => void;
};

export const TaskList = memo(function TaskList({
    taskListId,
    filterValue,
    title,
    removeTaskList,
    filteredTasks,
    addTask,
    removeTask,
    changeTaskStatus,
    updateTaskListTitle,
    updateTaskText,
    getButtonIsActive,
    setFilterValue,
}: TaskListPropsType) {
    const addTaskHandler = (taskText: string) => {
        addTask(taskListId, taskText);
    };

    const updateTaskTextHandler = useCallback(
        (taskId: number, newText: string) => {
            updateTaskText(taskListId, taskId, newText);
        },
        [taskListId, updateTaskText],
    );

    const changeTaskStatusHandler = useCallback(
        (taskId: number, newStatus: boolean) => {
            changeTaskStatus(taskListId, taskId, newStatus);
        },
        [taskListId, changeTaskStatus],
    );

    const removeTaskHandler = useCallback(
        (taskId: number) => {
            removeTask(taskListId, taskId);
        },
        [taskListId, removeTask],
    );

    const updateTaskListTitleHandler = (newTitle: string) => {
        updateTaskListTitle(taskListId, newTitle);
    };

    const removeTaskListHandler = () => {
        removeTaskList(taskListId);
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
                        removeTask={removeTaskHandler}
                        changeTaskStatus={changeTaskStatusHandler}
                        updateTaskText={updateTaskTextHandler}
                    />
                ))}
            </ul>
        :   <p>thid tasklist doesnt have any tasks</p>;

    return (
        <div>
            <div>
                <h2>
                    <EditableSpan callBack={updateTaskListTitleHandler}>
                        {title}
                    </EditableSpan>
                </h2>
                <Button onClick={removeTaskListHandler}>X</Button>
            </div>
            <InputTextSender callBack={addTaskHandler} />
            {tasksOrNoTasksText}
            <Button
                className={
                    getButtonIsActive(ALL_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={() => setFilterValue(taskListId, ALL_BUTTON_NAME)}
            >
                {ALL_BUTTON_NAME}
            </Button>
            <Button
                className={
                    getButtonIsActive(ACTIVE_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={() => setFilterValue(taskListId, ACTIVE_BUTTON_NAME)}
            >
                {ACTIVE_BUTTON_NAME}
            </Button>
            <Button
                className={
                    getButtonIsActive(COMPLETED_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={() =>
                    setFilterValue(taskListId, COMPLETED_BUTTON_NAME)
                }
            >
                {COMPLETED_BUTTON_NAME}
            </Button>
        </div>
    );
});
