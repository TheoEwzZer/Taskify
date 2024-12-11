import { Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { ReactElement } from "react";
import { Task, TaskStatus } from "../../types";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanTask } from "./kanban-task";

interface KanbanColumnProps {
  board: TaskStatus;
  tasks: Task[];
}

export const KanbanColumn: ({
  board,
  tasks,
}: KanbanColumnProps) => ReactElement = ({ board, tasks }) => (
  <div
    key={board}
    className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted p-1.5"
  >
    <KanbanColumnHeader
      board={board}
      taskCount={tasks.length}
    />
    <Droppable droppableId={board}>
      {(provided: DroppableProvided): ReactElement => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="h-full min-h-[200px] py-1.5"
        >
          {tasks.map(
            (task: Task, index: number): ReactElement => (
              <KanbanTask
                key={task.$id}
                task={task}
                index={index}
              />
            )
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);
