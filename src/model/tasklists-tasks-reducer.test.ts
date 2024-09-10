import { getUniqueId } from '@/utils/uniqueIdProvider';
import { tasksReducer, addNewTasksAC } from './tasks-reducer';
import { taskListReducer, addTaskListAC } from './tasklists-reducer';
import { TaskListType, TasksType } from '@/App';

test(`task list and its corresponding tasks should have equal IDs`, () => {
    const taskListsState: Array<TaskListType> = [];
    const tasksState: TasksType = {};

    const id = getUniqueId();
    const newTaskListTitle = 'New Task List Title';

    const newTaskListsState = taskListReducer(
        taskListsState,
        addTaskListAC(id, newTaskListTitle),
    );
    const newTasksState = tasksReducer(tasksState, addNewTasksAC(id));

    const taskListId = newTaskListsState[0].id;
    const tasksId = Object.keys(newTasksState)[0];

    expect(taskListId).toBe(tasksId);
});
