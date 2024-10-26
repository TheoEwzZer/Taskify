import { DragDropContext } from "@hello-pangea/dnd";
import { ReactElement, useState } from "react";
import { Task, TaskStatus } from "../types";
import { KanbanColumnHeader } from "./kanban-column-header";

interface DataKanbanProps {
  data: Task[];
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

export const DataKanban: ({ data }: DataKanbanProps) => ReactElement = ({
  data,
}) => {
  const [tasks, setTasks] = useState<TasksState>((): TasksState => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task: Task): void => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status: string): void => {
      initialTasks[status as TaskStatus].sort(
        (a: Task, b: Task): number => a.position - b.position
      );
    });

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={(): void => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board: TaskStatus): ReactElement => {
          return (
            <div
              key={board}
              className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted p-1.5"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
