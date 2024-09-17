import { useCallback, useMemo, useReducer } from 'react';
import { InputTextSender } from './components/InputTextSender';
import {
    TaskList,
    TaskType,
    ButtonNameType,
    ALL_BUTTON_NAME,
    ACTIVE_BUTTON_NAME,
    COMPLETED_BUTTON_NAME,
    FilterType,
    TasksType,
} from './components/taskList/TaskList';
// should be injected:
import { getUniqueStringId } from './utils/uniqueIdProvider';
// ------------------
import {
    taskListReducer,
    removeTaskListAC,
    setFilterAC,
    updateTaskListTitleAC,
    addTaskListAC,
} from './model/tasklists-reducer';
import {
    tasksReducer,
    addTaskAC,
    removeTaskAC,
    changeTaskStatusAC,
    updateTaskTextAC,
} from './model/tasks-reducer';

export type TaskListType = {
    id: string;
    title: string;
    filter: FilterType;
};

export const All_FILTER_VALUE = 'all';
export const COMPLETED_FILTER_VALUE = 'completed';
export const ACTIVE_FILTER_VALUE = 'active';

const taskList1Id = getUniqueStringId();
const taskList2Id = getUniqueStringId();

const initialTaskLists: Array<TaskListType> = [
    { id: taskList1Id, title: 'first', filter: All_FILTER_VALUE },
    { id: taskList2Id, title: 'second', filter: ACTIVE_FILTER_VALUE },
];

const initialTasks: TasksType = {
    [taskList1Id]: [
        { id: 2, text: 'second task', isDone: true },
        { id: 1, text: 'first task', isDone: false },
    ],
    [taskList2Id]: [
        { id: 2, text: 'forth task', isDone: false },
        { id: 1, text: 'third task', isDone: true },
    ],
};

type FilteringStratType = {
    [K in Exclude<FilterType, typeof All_FILTER_VALUE>]: (
        tasks: Array<TaskType>,
    ) => Array<TaskType>;
};

const filteringStrats: FilteringStratType = {
    [ACTIVE_FILTER_VALUE]: (tasks: Array<TaskType>) =>
        tasks.filter((t) => !t.isDone),
    [COMPLETED_FILTER_VALUE]: (tasks: Array<TaskType>) =>
        tasks.filter((t) => t.isDone),
};

type SetFilterValueStratType = {
    [K in ButtonNameType]: (taskListId: string) => void;
};

const setFilterValueStrats = (
    setFilterValue: (taskListId: string, filterValue: FilterType) => void,
): SetFilterValueStratType => {
    return {
        [ALL_BUTTON_NAME]: (taskListId: string) =>
            setFilterValue(taskListId, All_FILTER_VALUE),
        [ACTIVE_BUTTON_NAME]: (taskListId: string) =>
            setFilterValue(taskListId, ACTIVE_FILTER_VALUE),
        [COMPLETED_BUTTON_NAME]: (taskListId: string) =>
            setFilterValue(taskListId, COMPLETED_FILTER_VALUE),
    };
};

const filterTasks = (
    tasks: Array<TaskType>,
    filter: FilterType,
): Array<TaskType> => {
    if (filter !== All_FILTER_VALUE) {
        const strat = filteringStrats[filter];
        return strat(tasks);
    }
    return tasks;
};

const getButtonIsActive = (
    buttonName: ButtonNameType,
    currentFilterValue: FilterType,
): boolean => {
    return (
        (currentFilterValue === All_FILTER_VALUE &&
            buttonName === ALL_BUTTON_NAME) ||
        (currentFilterValue === ACTIVE_FILTER_VALUE &&
            buttonName === ACTIVE_BUTTON_NAME) ||
        (currentFilterValue === COMPLETED_FILTER_VALUE &&
            buttonName === COMPLETED_BUTTON_NAME)
    );
};

function TaskApp() {
    const [taskLists, taskListDispatch] = useReducer(
        taskListReducer,
        initialTaskLists,
    );

    const [tasks, tasksDispatch] = useReducer(tasksReducer, initialTasks);

    const addTaskList = useCallback((title: string): void => {
        const action = addTaskListAC(title);
        taskListDispatch(action);
        tasksDispatch(action);
    }, []);

    const removeTaskList = useCallback((taskListId: string) => {
        taskListDispatch(removeTaskListAC(taskListId));
        tasksDispatch(removeTaskListAC(taskListId));
    }, []);

    const filterValueStrats = useMemo(
        () =>
            setFilterValueStrats(
                (taskListId: string, filterValue: FilterType) => {
                    taskListDispatch(setFilterAC(taskListId, filterValue));
                },
            ),
        [],
    );

    const addTask = useCallback((taskListId: string, taskTitle: string) => {
        tasksDispatch(addTaskAC({ taskListId, taskTitle }));
    }, []);

    const removeTask = useCallback((taskListId: string, taskId: number) => {
        tasksDispatch(removeTaskAC(taskListId, taskId));
    }, []);

    const changeTaskStatus = useCallback(
        (taskListId: string, taskId: number, newStatus: boolean) => {
            tasksDispatch(changeTaskStatusAC(taskListId, taskId, newStatus));
        },
        [],
    );

    const updateTaskListTitle = useCallback(
        (taskListId: string, newTitle: string) => {
            taskListDispatch(updateTaskListTitleAC({ taskListId, newTitle }));
        },
        [],
    );

    const updateTaskText = useCallback(
        (taskListId: string, taskId: number, newText: string) => {
            tasksDispatch(updateTaskTextAC({ taskListId, taskId, newText }));
        },
        [],
    );

    const setFilterValue = useCallback(
        (taskListId: string, buttonName: ButtonNameType): void => {
            const strat = filterValueStrats[buttonName];
            strat(taskListId);
        },
        [filterValueStrats],
    );

    const jsxTaskLists = taskLists.map(({ id: taskListId, title, filter }) => {
        return (
            <TaskList
                filterValue={filter}
                taskListId={taskListId}
                key={taskListId}
                title={title}
                filterTasksFn={filterTasks}
                tasks={tasks}
                getButtonIsActive={getButtonIsActive}
                onRemoveTaskList={removeTaskList}
                onAddTask={addTask}
                onRemoveTask={removeTask}
                onChangeTaskStatus={changeTaskStatus}
                onUpdateTaskListTitle={updateTaskListTitle}
                onUpdateTaskText={updateTaskText}
                onSetFilterValue={setFilterValue}
            />
        );
    });

    return (
        <div>
            <InputTextSender callBack={addTaskList} />
            <div>{jsxTaskLists}</div>
        </div>
    );
}

export default TaskApp;
