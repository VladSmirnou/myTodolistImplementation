import { TaskType } from '@/components/taskList/TaskList';

export const taskItemGetter = (index: number) => {
    return (tasks: Array<TaskType>): TaskType | undefined => {
        return tasks[index];
    };
};
