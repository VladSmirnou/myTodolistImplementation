import { InputTextSender } from './components/InputTextSender';
import { useReducer } from 'react';
import { TaskList } from './components/taskList/TaskList';
// should be injected:
import { getUniqueId } from './utils/uniqueIdProvider';
// ------------------
import {
    taskListReducer,
    removeTaskListAC,
    setFilterAC,
    updateTaskListTitleAC,
} from './model/taskListReducer';
import { addTaskListAC } from './model/taskListReducer';
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

export type TaskType = {
    id: number;
    text: string;
    isDone: boolean;
};

export type TasksType = {
    [key: string]: Array<TaskType>;
};

export type FilterType = 'all' | 'completed' | 'active';

const taskList1Id = getUniqueId();
const taskList2Id = getUniqueId();

const initialTaskLists: Array<TaskListType> = [
    { id: taskList1Id, title: 'first', filter: 'all' },
    { id: taskList2Id, title: 'second', filter: 'active' },
];

const initialTasks: TasksType = {
    [taskList1Id]: [
        { id: 1, text: 'first task', isDone: false },
        { id: 2, text: 'second task', isDone: true },
    ],
    [taskList2Id]: [
        { id: 1, text: 'third task', isDone: true },
        { id: 2, text: 'forth task', isDone: false },
    ],
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
        if (filter !== 'all') {
            return tasks.filter(
                (t) =>
                    (t.isDone && filter === 'completed') ||
                    (!t.isDone && filter === 'active'),
            );
        }
        return tasks;
    };

    const setFilterValue = (taskListId: string, filterValue: FilterType) => {
        taskListDispatch(setFilterAC(taskListId, filterValue));
    };

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

    const jsxTaskLists = taskLists.map((tl) => {
        const taskListId: string = tl.id;
        return (
            <TaskList
                key={taskListId}
                title={tl.title}
                filteredTasks={filterTasks(tasks[taskListId], tl.filter)}
                removeTaskList={() => removeTaskList(taskListId)}
                setFilterAll={() => setFilterValue(taskListId, 'all')}
                setFilterActive={() => setFilterValue(taskListId, 'active')}
                setFilterCompleted={() =>
                    setFilterValue(taskListId, 'completed')
                }
                addTask={addTaskWrapper(taskListId)}
                removeTask={removeTaskWrapper(taskListId)}
                changeTaskStatus={changeTaskStatusWrapper(taskListId)}
                updateTaskListTitle={updateTaskListTitleWrapper(taskListId)}
                updateTaskText={updateTaskTextWrapper(taskListId)}
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
