import { TaskListType, All_FILTER_VALUE, ACTIVE_FILTER_VALUE } from '@/App';
import { getUniqueId } from '@/utils/uniqueIdProvider';
import {
    taskListReducer,
    addTaskListAC,
    removeTaskListAC,
    setFilterAC,
    updateTaskListTitleAC,
} from './tasklists-reducer';

const taskList1Id = getUniqueId();
const taskList2Id = getUniqueId();

let oldState: Array<TaskListType>;

beforeEach(() => {
    oldState = [
        { id: taskList1Id, title: 'first', filter: All_FILTER_VALUE },
        { id: taskList2Id, title: 'second', filter: All_FILTER_VALUE },
    ];
});

test('should add a new task list', () => {
    const newTaskListTitle = 'New Task Title';
    const newState = taskListReducer(oldState, addTaskListAC(newTaskListTitle));

    expect(newState.length).toBe(3);
    expect(newState[0].title).toBe(newTaskListTitle);
    expect(newState[0].filter).toBe(All_FILTER_VALUE);
});

test('should remove a proper task list', () => {
    const newState = taskListReducer(oldState, removeTaskListAC(taskList1Id));

    expect(newState.length).toBe(1);
    expect(newState[0].id).toBe(taskList2Id);
});

test('should set a proper filter value to a proper task list', () => {
    const newFilterValue = ACTIVE_FILTER_VALUE;

    const newState = taskListReducer(
        oldState,
        setFilterAC(taskList1Id, newFilterValue),
    );

    expect(newState[0].filter).toBe(newFilterValue);
    expect(newState[1].filter).toBe(All_FILTER_VALUE);
});

test('should update a title of a proper task list', () => {
    const updatedTaskListTitle = 'New Task Title';

    const newState = taskListReducer(
        oldState,
        updateTaskListTitleAC(taskList1Id, updatedTaskListTitle),
    );

    expect(newState[0].title).toBe(updatedTaskListTitle);
    expect(newState[1].title).toBe('second');
});
