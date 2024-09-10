import { TaskListType } from '@/App';
import { FilterType } from '@/App';

export type AddTaskListActionType = {
    type: 'ADD-TASK-LIST';
    payload: {
        id: string;
        title: string;
    };
};

export type RemoveTaskListActionType = {
    type: 'REMOVE-TASK-LIST';
    payload: {
        taskListId: string;
    };
};

type SetFilterActionType = {
    type: 'SET-FILTER';
    payload: {
        taskListId: string;
        filterValue: FilterType;
    };
};

type UpdateTaskListTitleActionType = {
    type: 'UPDATE-TASK-LIST-TITLE';
    payload: {
        taskListId: string;
        newTitle: string;
    };
};

type ActionType =
    | AddTaskListActionType
    | RemoveTaskListActionType
    | SetFilterActionType
    | UpdateTaskListTitleActionType;

export const taskListReducer = (
    state: Array<TaskListType>,
    action: ActionType,
) => {
    switch (action.type) {
        case 'ADD-TASK-LIST': {
            const newTaskList: TaskListType = {
                id: action.payload.id,
                title: action.payload.title,
                filter: 'all',
            };
            return [newTaskList, ...state];
        }
        case 'REMOVE-TASK-LIST': {
            return state.filter((tl) => tl.id !== action.payload.taskListId);
        }
        case 'SET-FILTER': {
            return state.map((tl) =>
                tl.id === action.payload.taskListId ?
                    { ...tl, filter: action.payload.filterValue }
                :   tl,
            );
        }
        case 'UPDATE-TASK-LIST-TITLE': {
            return state.map((tl) =>
                tl.id === action.payload.taskListId ?
                    {
                        ...tl,
                        title: action.payload.newTitle,
                    }
                :   tl,
            );
        }
        default:
            return state;
    }
};

export const addTaskListAC = (
    id: string,
    title: string,
): AddTaskListActionType => {
    return {
        type: 'ADD-TASK-LIST',
        payload: { id, title },
    };
};

export const removeTaskListAC = (
    taskListId: string,
): RemoveTaskListActionType => {
    return {
        type: 'REMOVE-TASK-LIST',
        payload: {
            taskListId,
        },
    };
};

export const setFilterAC = (
    taskListId: string,
    filterValue: FilterType,
): SetFilterActionType => {
    return {
        type: 'SET-FILTER',
        payload: {
            taskListId,
            filterValue,
        },
    };
};

export const updateTaskListTitleAC = (
    taskListId: string,
    newTitle: string,
): UpdateTaskListTitleActionType => {
    return {
        type: 'UPDATE-TASK-LIST-TITLE',
        payload: {
            taskListId,
            newTitle,
        },
    };
};
