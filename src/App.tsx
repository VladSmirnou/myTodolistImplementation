import { InputTextSender } from './components/InputTextSender';
import { useState } from 'react';
import { TaskList } from './components/taskList/TaskList';

type TaskListType = {
    id: string;
    title: string;
    filter: FilterType;
};

export type TaskType = {
    id: number;
    text: string;
    isDone: boolean;
};

type TasksType = {
    [key: string]: Array<TaskType>;
};

export type FilterType = 'all' | 'completed' | 'active';

function TaskApp() {
    const [taskLists, setTaskLists] = useState<Array<TaskListType>>(() => [
        { id: '1', title: 'first', filter: 'all' },
        { id: '2', title: 'second', filter: 'active' },
    ]);

    const [tasks, setTasks] = useState<TasksType>(() => ({
        1: [
            { id: 1, text: 'first task', isDone: false },
            { id: 2, text: 'second task', isDone: true },
        ],
        2: [
            { id: 1, text: 'third task', isDone: true },
            { id: 2, text: 'forth task', isDone: false },
        ],
    }));

    const addTaskList = (title: string): void => {
        const id = '3';
        const newTaskList: TaskListType = {
            id,
            title,
            filter: 'all',
        };
        setTaskLists([newTaskList, ...taskLists]);
        setTasks({
            ...tasks,
            [id]: [],
        });
    };

    const removeTaskList = (taskListId: string) => {
        setTaskLists(taskLists.filter((tl) => tl.id !== taskListId));
        delete tasks[taskListId];
        setTasks({
            ...tasks,
        });
    };

    const filterTasks = (
        tasks: Array<TaskType>,
        filter: FilterType,
    ): Array<TaskType> => {
        if (filter !== 'all') {
            return tasks.filter(
                (t) =>
                    (t.isDone && filter === 'completed') ||
                    (!t.isDone && filter === 'active') ||
                    false,
            );
        }
        return tasks;
    };

    const setFilterValue = (taskListId: string, filterValue: FilterType) => {
        setTaskLists(
            taskLists.map((tl) =>
                tl.id === taskListId ?
                    {
                        ...tl,
                        filter: filterValue,
                    }
                :   tl,
            ),
        );
    };

    const addTaskWrapper = (taskListId: string) => {
        return (taskTitle: string) => {
            const newTask: TaskType = {
                id: 3,
                text: taskTitle,
                isDone: false,
            };
            setTasks({
                ...tasks,
                [taskListId]: [newTask, ...tasks[taskListId]],
            });
        };
    };

    const removeTaskWrapper = (taskListId: string) => {
        return (taskId: number) => {
            setTasks({
                ...tasks,
                [taskListId]: tasks[taskListId].filter((t) => t.id !== taskId),
            });
        };
    };

    const changeTaskStatusWrapper = (taskListId: string) => {
        return (taskId: number, newStatus: boolean) => {
            setTasks({
                ...tasks,
                [taskListId]: tasks[taskListId].map((t) =>
                    t.id === taskId ?
                        {
                            ...t,
                            isDone: newStatus,
                        }
                    :   t,
                ),
            });
        };
    };

    const updateTaskListTitleWrapper = (taskListId: string) => {
        return (newTitle: string) =>
            setTaskLists(
                taskLists.map((tl) =>
                    tl.id === taskListId ?
                        {
                            ...tl,
                            title: newTitle,
                        }
                    :   tl,
                ),
            );
    };

    const updateTaskTextWrapper = (taskListId: string) => {
        return (taskId: number, newText: string) => {
            setTasks({
                ...tasks,
                [taskListId]: tasks[taskListId].map((t) =>
                    t.id === taskId ?
                        {
                            ...t,
                            text: newText,
                        }
                    :   t,
                ),
            });
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
