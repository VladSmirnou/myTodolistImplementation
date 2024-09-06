import { TaskListType } from '@/App';
import { FilterType } from '@/App';

type AddTaskListActionType = {
    type: 'add_task_list';
    payload: {
        id: string;
        title: string;
    };
};

type RemoveTaskListActionType = {
    type: 'remove_task_list';
    payload: {
        taskListId: string;
    };
};

type SetFilterActionType = {
    type: 'set_filter';
    payload: {
        taskListId: string;
        filterValue: FilterType;
    };
};

type UpdateTaskListTitleActionType = {
    type: 'update_task_list_title';
    payload: {
        taskListId: string;
        newTitle: string;
    };
};

type TaskListActionType =
    | AddTaskListActionType
    | RemoveTaskListActionType
    | SetFilterActionType
    | UpdateTaskListTitleActionType;

export const taskListReducer = (
    state: Array<TaskListType>,
    action: TaskListActionType,
) => {
    switch (action.type) {
        case 'add_task_list': {
            const newTaskList: TaskListType = {
                id: action.payload.id,
                title: action.payload.title,
                filter: 'all',
            };
            return [newTaskList, ...state];
        }
        case 'remove_task_list': {
            return state.filter((tl) => tl.id !== action.payload.taskListId);
        }
        case 'set_filter': {
            return state.map((tl) =>
                tl.id === action.payload.taskListId ?
                    { ...tl, filter: action.payload.filterValue }
                :   tl,
            );
        }
        case 'update_task_list_title': {
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
        type: 'add_task_list',
        payload: { id, title },
    };
};

export const removeTaskListAC = (
    taskListId: string,
): RemoveTaskListActionType => {
    return {
        type: 'remove_task_list',
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
        type: 'set_filter',
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
        type: 'update_task_list_title',
        payload: {
            taskListId,
            newTitle,
        },
    };
};
