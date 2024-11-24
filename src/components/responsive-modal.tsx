import { useIsMobile } from "@/hooks/use-mobile";
import { ReactElement, ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";

interface ResponsiveModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal: (props: ResponsiveModalProps) => ReactElement = ({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) => {
  const isMobile: boolean = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="hide-scrollbar max-h-[90vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
          <DialogTitle></DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <div className="hide-scrollbar max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
