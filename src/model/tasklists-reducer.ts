import { TaskListType } from '@/App';
import { FilterType } from '@/components/taskList/TaskList';
import { getUniqueStringId } from '@/utils/uniqueIdProvider';

export type AddTaskListActionType = ReturnType<typeof addTaskListAC>;
export type RemoveTaskListActionType = ReturnType<typeof removeTaskListAC>;
type SetFilterActionType = ReturnType<typeof setFilterAC>;
type UpdateTaskListTitleActionType = ReturnType<typeof updateTaskListTitleAC>;
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

export const addTaskListAC = (title: string) => {
    const id = getUniqueStringId();
    return {
        type: 'ADD-TASK-LIST',
        payload: { id, title },
    } as const;
};

export const removeTaskListAC = (taskListId: string) => {
    return {
        type: 'REMOVE-TASK-LIST',
        payload: {
            taskListId,
        },
    } as const;
};

export const setFilterAC = (taskListId: string, filterValue: FilterType) => {
    return {
        type: 'SET-FILTER',
        payload: {
            taskListId,
            filterValue,
        },
    } as const;
};

export const updateTaskListTitleAC = (payload: {
    taskListId: string;
    newTitle: string;
}) => {
    return {
        type: 'UPDATE-TASK-LIST-TITLE',
        payload,
    } as const;
};
