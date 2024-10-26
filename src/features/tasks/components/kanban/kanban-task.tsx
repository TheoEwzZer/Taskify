import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import { ReactElement } from "react";
import { Task } from "../../types";
import { KanbanCard } from "./kanban-card";

interface KanbanTaskProps {
  task: Task;
  index: number;
}

export const KanbanTask: ({ task, index }: KanbanTaskProps) => ReactElement = ({
  task,
  index,
}) => (
  <Draggable
    key={task.$id}
    draggableId={task.$id}
    index={index}
  >
    {(provided: DraggableProvided): ReactElement => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <KanbanCard task={task} />
      </div>
    )}
  </Draggable>
);
