import {
    tasksReducer,
    addTaskAC,
    removeTaskAC,
    changeTaskStatusAC,
    updateTaskTextAC,
} from './tasks-reducer';
import { removeTaskListAC, addTaskListAC } from './tasklists-reducer';
import { TasksType } from '@/App';
import { getUniqueId } from '@/utils/uniqueIdProvider';

const taskList1Id = getUniqueId();
const taskList2Id = getUniqueId();

let oldState: TasksType;

beforeEach(() => {
    oldState = {
        [taskList1Id]: [
            { id: 2, text: 'second task', isDone: false },
            { id: 1, text: 'first task', isDone: false },
        ],
        [taskList2Id]: [
            { id: 2, text: 'forth task', isDone: false },
            { id: 1, text: 'third task', isDone: false },
        ],
    };
});

test('should add an empty tasks array', () => {
    const action = addTaskListAC('title');
    const newState = tasksReducer(oldState, action);
    const keys = Object.keys(newState);

    expect(keys.length).toBe(3);
    expect(newState[action.payload.id]).toEqual([]);
});

test(`should remove corresponding tasks
    when the specified task list is removed`, () => {
    const newState = tasksReducer(oldState, removeTaskListAC(taskList1Id));
    const keys = Object.keys(newState);

    expect(keys.length).toBe(1);
    expect(Object.hasOwn(newState, taskList1Id)).toBeFalsy();
});

test('should add a new task to a proper task list', () => {
    const newTaskText = 'New Task Title';

    const newState = tasksReducer(
        oldState,
        addTaskAC({ taskListId: taskList1Id, taskTitle: newTaskText }),
    );

    expect(newState[taskList1Id].length).toBe(3);
    expect(newState[taskList1Id][0].id).toBeDefined();
    expect(newState[taskList1Id][0].text).toBe(newTaskText);
    expect(newState[taskList1Id][0].isDone).toBe(false);
});

test('should remove a task from a proper task list', () => {
    const taskId = 1;
    const newState = tasksReducer(oldState, removeTaskAC(taskList1Id, taskId));

    expect(newState[taskList1Id].length).toBe(1);
    expect(newState[taskList1Id][0].id).toBe(2);
});

test('should change the task status of a proper task', () => {
    const taskId = 2;
    const newTaskStatus = true;

    const newState = tasksReducer(
        oldState,
        changeTaskStatusAC(taskList1Id, taskId, newTaskStatus),
    );

    expect(newState[taskList1Id][0].isDone).toBe(true);
    expect(newState[taskList1Id][1].isDone).toBe(false);
});

test('should change the text of a proper task', () => {
    const taskId = 2;
    const newTaskText = 'hello world';

    const newState = tasksReducer(
        oldState,
        updateTaskTextAC({
            taskListId: taskList1Id,
            taskId,
            newText: newTaskText,
        }),
    );

    expect(newState[taskList1Id][0].text).toBe('hello world');
    expect(newState[taskList1Id][1].text).toBe('first task');
});
