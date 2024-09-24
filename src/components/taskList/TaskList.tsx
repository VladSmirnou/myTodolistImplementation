import { Button } from '../SuperButton';
import { InputTextSender } from '../InputTextSender';
import { Task } from './task/Task';
import { EditableSpan } from '../EditableSpan';
import s from './taskList.module.css';
import { memo, useCallback, useMemo } from 'react';

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
    tasks: Array<TaskType>;
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
    const handleRemoveTask = useCallback(
        (taskId: number) => {
            onRemoveTask(taskListId, taskId);
        },
        [taskListId, onRemoveTask],
    );

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

    const filteredTasks = useMemo(
        () =>
            filterTasksFn(tasks, filterValue).map((t) => (
                <Task
                    task={t}
                    key={t.id}
                    onRemoveTask={handleRemoveTask}
                    onChangeTaskStatus={handleChangeTaskStatus}
                    onUpdateTaskText={handleUpdateTaskText}
                />
            )),
        [
            tasks,
            filterValue,
            filterTasksFn,
            handleChangeTaskStatus,
            handleRemoveTask,
            handleUpdateTaskText,
        ],
    );

    const handleAddTask = useCallback(
        (taskText: string) => {
            onAddTask(taskListId, taskText);
        },
        [taskListId, onAddTask],
    );

    const handleUpdateTaskListTitle = useCallback(
        (newTitle: string) => {
            onUpdateTaskListTitle(taskListId, newTitle);
        },
        [taskListId, onUpdateTaskListTitle],
    );

    const handleRemoveTaskList = useCallback(() => {
        onRemoveTaskList(taskListId);
    }, [taskListId, onRemoveTaskList]);

    const setAllFilterValue = useCallback(
        () => onSetFilterValue(taskListId, ALL_BUTTON_NAME),
        [taskListId, onSetFilterValue],
    );
    const setActiveFilterValue = useCallback(
        () => onSetFilterValue(taskListId, ACTIVE_BUTTON_NAME),
        [taskListId, onSetFilterValue],
    );
    const setCompletedFilterValue = useCallback(
        () => onSetFilterValue(taskListId, COMPLETED_BUTTON_NAME),
        [taskListId, onSetFilterValue],
    );

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
            {filteredTasks.length ?
                <ul>{filteredTasks}</ul>
            :   <p>thid tasklist doesnt have any tasks</p>}
            <Button
                className={
                    getButtonIsActive(ALL_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={setAllFilterValue}
            >
                {ALL_BUTTON_NAME}
            </Button>
            <Button
                className={
                    getButtonIsActive(ACTIVE_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={setActiveFilterValue}
            >
                {ACTIVE_BUTTON_NAME}
            </Button>
            <Button
                className={
                    getButtonIsActive(COMPLETED_BUTTON_NAME, filterValue) ?
                        s.active
                    :   ''
                }
                onClick={setCompletedFilterValue}
            >
                {COMPLETED_BUTTON_NAME}
            </Button>
        </div>
    );
});
