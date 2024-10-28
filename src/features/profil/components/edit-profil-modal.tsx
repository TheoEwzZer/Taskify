"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditProfilModal } from "@/features/profil/hooks/use-edit-profil-modal";
import { ReactElement } from "react";
import { EditProfilFormWrapper } from "./edit-profil-form-wrapper";

export const EditProfilModal: () => ReactElement = () => {
  const { isOpen, setIsOpen, close } = useEditProfilModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <EditProfilFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
