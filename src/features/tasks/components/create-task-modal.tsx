"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { ReactElement } from "react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";

export const CreateTaskModal: () => ReactElement = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
