import { Options, parseAsBoolean, useQueryState } from "nuqs";

export const useCreateWorkspaceModal: () => {
  isOpen: boolean;
  open: () => Promise<URLSearchParams>;
  close: () => Promise<URLSearchParams>;
  setIsOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
} = (): {
  isOpen: boolean;
  open: () => Promise<URLSearchParams>;
  close: () => Promise<URLSearchParams>;
  setIsOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
} => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-workspace",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open: () => Promise<URLSearchParams> = () => setIsOpen(true);
  const close: () => Promise<URLSearchParams> = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
