import { Button } from '../SuperButton';
import { InputTextSender } from '../InputTextSender';
import { Task } from './task/Task';
import { EditableSpan } from '../EditableSpan';
import { TaskType } from '@/App';

type TaskListPropsType = {
    title: string;
    removeTaskList: () => void;
    filteredTasks: Array<TaskType>;
    setFilterAll: () => void;
    setFilterActive: () => void;
    setFilterCompleted: () => void;
    addTask: (taskTitle: string) => void;
    removeTask: (taskId: number) => void;
    changeTaskStatus: (taskId: number, newStatus: boolean) => void;
    updateTaskListTitle: (newTitle: string) => void;
    updateTaskText: (taskId: number, newText: string) => void;
};

export const TaskList = (props: TaskListPropsType) => {
    const changeTaskStatusWrapper = (taskId: number) => {
        return (newStatus: boolean) => {
            props.changeTaskStatus(taskId, newStatus);
        };
    };

    const updateTaskTextWrapper = (taskId: number) => {
        return (newText: string) => {
            props.updateTaskText(taskId, newText);
        };
    };

    const tasksOrNoTasksText =
        props.filteredTasks.length ?
            <ul>
                {props.filteredTasks.map((t) => (
                    <Task
                        key={t.id}
                        isDone={t.isDone}
                        text={t.text}
                        removeTask={() => props.removeTask(t.id)}
                        changeTaskStatus={changeTaskStatusWrapper(t.id)}
                        updateTaskText={updateTaskTextWrapper(t.id)}
                    />
                ))}
            </ul>
        :   <p>thid tasklist doesnt have any tasks</p>;

    return (
        <div>
            <div>
                <h2>
                    <EditableSpan callBack={props.updateTaskListTitle}>
                        {props.title}
                    </EditableSpan>
                </h2>
                <Button onClick={props.removeTaskList}>X</Button>
            </div>
            <InputTextSender callBack={props.addTask} />
            {tasksOrNoTasksText}
            <Button onClick={props.setFilterAll}>All</Button>
            <Button onClick={props.setFilterActive}>Active</Button>
            <Button onClick={props.setFilterCompleted}>Completed</Button>
        </div>
    );
};
