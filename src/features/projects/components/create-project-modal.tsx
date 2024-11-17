"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { ReactElement } from "react";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import { CreateProjectFormWrapper } from "./create-project-form-wrapper";

export const CreateProjectModal: () => ReactElement = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateProjectFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
