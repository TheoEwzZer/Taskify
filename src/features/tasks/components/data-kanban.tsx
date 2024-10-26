import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "../types";
import { KanbanColumn } from "./kanban-column";

interface DataKanbanProps {
  data: Task[];
  onChange: (
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => void;
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

export const DataKanban: ({
  data,
  onChange,
}: DataKanbanProps) => ReactElement = ({ data, onChange }) => {
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

  useEffect((): void => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task: Task): void => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status: string): void => {
      newTasks[status as TaskStatus].sort(
        (a: Task, b: Task): number => a.position - b.position
      );
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatesPayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      setTasks((prevTasks: TasksState): TasksState => {
        const newTasks = { ...prevTasks };

        const sourceColumn: Task[] = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        if (!movedTask) {
          console.error("No task found at the source index");
          return prevTasks;
        }

        const updatedMovedTask: Task =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        newTasks[sourceStatus] = sourceColumn;

        const destinationColumn: Task[] = [...newTasks[destinationStatus]];
        destinationColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destinationStatus] = destinationColumn;

        updatesPayload = [];

        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: updatedMovedTask.status,
          position: Math.min((destination.index + 1) * 1000, 1_000_100),
        });

        newTasks[destinationStatus].forEach(
          (task: Task, index: number): void => {
            if (task && task.$id !== updatedMovedTask.$id) {
              const newPosition: number = Math.min(
                (index + 1) * 1000,
                1_000_000
              );
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: task.status,
                  position: newPosition,
                });
              }
            }
          }
        );

        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task: Task, index: number): void => {
            if (task) {
              const newPosition: number = Math.min(
                (index + 1) * 1000,
                1_000_000
              );
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map(
          (board: TaskStatus): ReactElement => (
            <KanbanColumn
              key={board}
              board={board}
              tasks={tasks[board]}
            />
          )
        )}
      </div>
    </DragDropContext>
  );
};
