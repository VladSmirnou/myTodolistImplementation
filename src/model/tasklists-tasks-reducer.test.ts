import { tasksReducer } from './tasks-reducer';
import { taskListReducer, addTaskListAC } from './tasklists-reducer';
import { TaskListType, TasksType } from '@/App';

test(`task list and its corresponding tasks should have equal IDs`, () => {
    const taskListsState: Array<TaskListType> = [];
    const tasksState: TasksType = {};

    const newTaskListTitle = 'New Task List Title';
    const action = addTaskListAC(newTaskListTitle);

    const newTaskListsState = taskListReducer(taskListsState, action);
    const newTasksState = tasksReducer(tasksState, action);

    const taskListId = newTaskListsState[0].id;
    const tasksId = Object.keys(newTasksState)[0];

    expect(taskListId).toBe(tasksId);
});
