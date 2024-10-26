"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { ReactElement } from "react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
// import { CreateTaskForm } from "./create-task-form";

export const CreateTaskModal: () => ReactElement = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {/* <CreateTaskForm onCancel={close} /> */}
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
