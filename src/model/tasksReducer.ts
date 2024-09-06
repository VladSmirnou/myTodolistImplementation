import { TasksType } from '@/App';
import { taskItemGetter } from '@/utils/taskItemGetter';
import { TaskType } from '@/App';

const lastAddedTask = taskItemGetter(0);

type AddNewTasksActionType = {
    type: 'add_new_tasks';
    payload: {
        id: string;
    };
};

type RemoveTaskListActionType = {
    type: 'remove_tasks';
    payload: {
        taskListId: string;
    };
};

type AddTaskActionType = {
    type: 'add_task';
    payload: {
        taskListId: string;
        taskTitle: string;
    };
};

type RemoveTaskActionType = {
    type: 'remove_task';
    payload: {
        taskListId: string;
        taskId: number;
    };
};

type ChgangeTaskStatusActionType = {
    type: 'change_task_status';
    payload: {
        taskListId: string;
        taskId: number;
        newStatus: boolean;
    };
};

type UpdateTaskTextActionType = {
    type: 'update_task_text';
    payload: {
        taskListId: string;
        taskId: number;
        newText: string;
    };
};

type TasksActionType =
    | AddNewTasksActionType
    | RemoveTaskListActionType
    | AddTaskActionType
    | RemoveTaskActionType
    | ChgangeTaskStatusActionType
    | UpdateTaskTextActionType;

export const tasksReducer = (
    state: TasksType,
    action: TasksActionType,
): TasksType => {
    switch (action.type) {
        case 'add_new_tasks': {
            return {
                ...state,
                [action.payload.id]: [],
            };
        }
        case 'remove_tasks': {
            delete state[action.payload.taskListId];
            return { ...state };
        }
        case 'add_task': {
            const { taskListId, taskTitle } = action.payload;

            const lastTaskId = lastAddedTask(state[taskListId])?.id ?? 0;
            const newTaskId = lastTaskId + 1;

            const newTask: TaskType = {
                id: newTaskId,
                text: taskTitle,
                isDone: false,
            };
            return {
                ...state,
                [taskListId]: [newTask, ...state[taskListId]],
            };
        }
        case 'remove_task': {
            const { taskListId, taskId } = action.payload;
            return {
                ...state,
                [taskListId]: state[taskListId].filter((t) => t.id !== taskId),
            };
        }
        case 'change_task_status': {
            const { taskListId, taskId, newStatus } = action.payload;
            return {
                ...state,
                [taskListId]: state[taskListId].map((t) =>
                    t.id === taskId ?
                        {
                            ...t,
                            isDone: newStatus,
                        }
                    :   t,
                ),
            };
        }
        case 'update_task_text': {
            const { taskListId, taskId, newText } = action.payload;
            return {
                ...state,
                [taskListId]: state[taskListId].map((t) =>
                    t.id === taskId ?
                        {
                            ...t,
                            text: newText,
                        }
                    :   t,
                ),
            };
        }
        default:
            return state;
    }
};

export const addNewTasksAC = (id: string): AddNewTasksActionType => {
    return {
        type: 'add_new_tasks',
        payload: { id },
    };
};

export const removeTasksAC = (taskListId: string): RemoveTaskListActionType => {
    return {
        type: 'remove_tasks',
        payload: { taskListId },
    };
};

export const addTaskAC = (
    taskListId: string,
    taskTitle: string,
): AddTaskActionType => {
    return {
        type: 'add_task',
        payload: {
            taskListId,
            taskTitle,
        },
    };
};

export const removeTaskAC = (
    taskListId: string,
    taskId: number,
): RemoveTaskActionType => {
    return {
        type: 'remove_task',
        payload: {
            taskListId,
            taskId,
        },
    };
};

export const changeTaskStatusAC = (
    taskListId: string,
    taskId: number,
    newStatus: boolean,
): ChgangeTaskStatusActionType => {
    return {
        type: 'change_task_status',
        payload: { taskListId, taskId, newStatus },
    };
};

export const updateTaskTextAC = (
    taskListId: string,
    taskId: number,
    newText: string,
): UpdateTaskTextActionType => {
    return {
        type: 'update_task_text',
        payload: { taskListId, taskId, newText },
    };
};
