import { TasksType } from '@/components/taskList/TaskList';
import { taskItemGetter } from '@/utils/taskItemGetter';
import { TaskType } from '@/components/taskList/TaskList';
import {
    RemoveTaskListActionType,
    AddTaskListActionType,
} from './tasklists-reducer';

const lastAddedTask = taskItemGetter(0);

type AddTaskActionType = ReturnType<typeof addTaskAC>;
type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
type ChgangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
type UpdateTaskTextActionType = ReturnType<typeof updateTaskTextAC>;
type ActionType =
    | AddTaskActionType
    | RemoveTaskActionType
    | ChgangeTaskStatusActionType
    | UpdateTaskTextActionType
    | RemoveTaskListActionType
    | AddTaskListActionType;

export const tasksReducer = (
    state: TasksType,
    action: ActionType,
): TasksType => {
    switch (action.type) {
        case 'ADD-TASK-LIST': {
            return {
                ...state,
                [action.payload.id]: [],
            };
        }
        case 'REMOVE-TASK-LIST': {
            delete state[action.payload.taskListId];
            return { ...state };
        }
        case 'ADD-TASK': {
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
        case 'REMOVE-TASK': {
            const { taskListId, taskId } = action.payload;
            return {
                ...state,
                [taskListId]: state[taskListId].filter((t) => t.id !== taskId),
            };
        }
        case 'CHANGE-TASK-STATUS': {
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
        case 'UPDATE-TASK-TEXT': {
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

export const addTaskAC = (payload: {
    taskListId: string;
    taskTitle: string;
}) => {
    return {
        type: 'ADD-TASK',
        payload,
    } as const;
};

export const removeTaskAC = (taskListId: string, taskId: number) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskListId,
            taskId,
        },
    } as const;
};

export const changeTaskStatusAC = (
    taskListId: string,
    taskId: number,
    newStatus: boolean,
) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: { taskListId, taskId, newStatus },
    } as const;
};

export const updateTaskTextAC = (payload: {
    taskListId: string;
    taskId: number;
    newText: string;
}) => {
    return {
        type: 'UPDATE-TASK-TEXT',
        payload,
    } as const;
};
