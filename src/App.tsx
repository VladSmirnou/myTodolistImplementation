import { useMemo, useReducer } from 'react';
import { InputTextSender } from './components/InputTextSender';
import {
    TaskList,
    TaskType,
    ButtonNameType,
    ALL_BUTTON_NAME,
    ACTIVE_BUTTON_NAME,
    COMPLETED_BUTTON_NAME,
} from './components/taskList/TaskList';
// should be injected:
import { getUniqueId } from './utils/uniqueIdProvider';
// ------------------
import {
    taskListReducer,
    removeTaskListAC,
    setFilterAC,
    updateTaskListTitleAC,
    addTaskListAC,
} from './model/taskListReducer';
import {
    tasksReducer,
    addNewTasksAC,
    removeTasksAC,
    addTaskAC,
    removeTaskAC,
    changeTaskStatusAC,
    updateTaskTextAC,
} from './model/tasksReducer';

export type TaskListType = {
    id: string;
    title: string;
    filter: FilterType;
};

export type TasksType = {
    [key: string]: Array<TaskType>;
};

const All_FILTER_VALUE = 'all';
const COMPLETED_FILTER_VALUE = 'completed';
const ACTIVE_FILTER_VALUE = 'active';

export type FilterType =
    | typeof All_FILTER_VALUE
    | typeof COMPLETED_FILTER_VALUE
    | typeof ACTIVE_FILTER_VALUE;

const taskList1Id = getUniqueId();
const taskList2Id = getUniqueId();

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
    active: (tasks: Array<TaskType>) => tasks.filter((t) => !t.isDone),
    completed: (tasks: Array<TaskType>) => tasks.filter((t) => t.isDone),
};

type SetFilterValueStratType = {
    [K in ButtonNameType]: (taskListId: string) => void;
};

const setFilterValueStrats = (
    setFilterValue: (taskListId: string, filterValue: FilterType) => void,
): SetFilterValueStratType => {
    return {
        All: (taskListId: string) =>
            setFilterValue(taskListId, All_FILTER_VALUE),
        Active: (taskListId: string) =>
            setFilterValue(taskListId, ACTIVE_FILTER_VALUE),
        Completed: (taskListId: string) =>
            setFilterValue(taskListId, COMPLETED_FILTER_VALUE),
    };
};

function TaskApp() {
    const [taskLists, taskListDispatch] = useReducer(
        taskListReducer,
        initialTaskLists,
    );

    const [tasks, tasksDispatch] = useReducer(tasksReducer, initialTasks);

    const addTaskList = (title: string): void => {
        const id = getUniqueId();
        taskListDispatch(addTaskListAC(id, title));
        tasksDispatch(addNewTasksAC(id));
    };

    const removeTaskList = (taskListId: string) => {
        taskListDispatch(removeTaskListAC(taskListId));
        tasksDispatch(removeTasksAC(taskListId));
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

    const filterValueStrats = useMemo(
        () =>
            setFilterValueStrats(
                (taskListId: string, filterValue: FilterType) => {
                    taskListDispatch(setFilterAC(taskListId, filterValue));
                },
            ),
        [],
    );

    const addTaskWrapper = (taskListId: string) => {
        return (taskTitle: string) => {
            tasksDispatch(addTaskAC(taskListId, taskTitle));
        };
    };

    const removeTaskWrapper = (taskListId: string) => {
        return (taskId: number) => {
            tasksDispatch(removeTaskAC(taskListId, taskId));
        };
    };

    const changeTaskStatusWrapper = (taskListId: string) => {
        return (taskId: number, newStatus: boolean) => {
            tasksDispatch(changeTaskStatusAC(taskListId, taskId, newStatus));
        };
    };

    const updateTaskListTitleWrapper = (taskListId: string) => {
        return (newTitle: string) =>
            taskListDispatch(updateTaskListTitleAC(taskListId, newTitle));
    };

    const updateTaskTextWrapper = (taskListId: string) => {
        return (taskId: number, newText: string) => {
            tasksDispatch(updateTaskTextAC(taskListId, taskId, newText));
        };
    };

    const getButtonIsActiveWrapper = (currentFilterValue: FilterType) => {
        return (buttonName: ButtonNameType): boolean => {
            return (
                (currentFilterValue === All_FILTER_VALUE &&
                    buttonName === ALL_BUTTON_NAME) ||
                (currentFilterValue === ACTIVE_FILTER_VALUE &&
                    buttonName === ACTIVE_BUTTON_NAME) ||
                (currentFilterValue === COMPLETED_FILTER_VALUE &&
                    buttonName === COMPLETED_BUTTON_NAME)
            );
        };
    };

    const setFilterValueWrapper = (taskListId: string) => {
        return (buttonName: ButtonNameType): void => {
            const strat = filterValueStrats[buttonName];
            strat(taskListId);
        };
    };

    const jsxTaskLists = taskLists.map((tl) => {
        const { id: taskListId, filter } = tl;
        return (
            <TaskList
                key={taskListId}
                title={tl.title}
                filteredTasks={filterTasks(tasks[taskListId], filter)}
                removeTaskList={() => removeTaskList(taskListId)}
                addTask={addTaskWrapper(taskListId)}
                removeTask={removeTaskWrapper(taskListId)}
                changeTaskStatus={changeTaskStatusWrapper(taskListId)}
                updateTaskListTitle={updateTaskListTitleWrapper(taskListId)}
                updateTaskText={updateTaskTextWrapper(taskListId)}
                getButtonIsActive={getButtonIsActiveWrapper(filter)}
                setFilterValue={setFilterValueWrapper(taskListId)}
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
