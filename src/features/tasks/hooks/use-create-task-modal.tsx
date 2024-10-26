import { Options, parseAsBoolean, useQueryState } from "nuqs";

export const useCreateTaskModal: () => {
  isOpen: boolean;
  open: () => Promise<URLSearchParams>;
  close: () => Promise<URLSearchParams>;
  setIsOpen: <Shallow>(
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
} = (): {
  isOpen: boolean;
  open: () => Promise<URLSearchParams>;
  close: () => Promise<URLSearchParams>;
  setIsOpen: <Shallow>(
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
} => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open: () => Promise<URLSearchParams> = () => setIsOpen(true);
  const close: () => Promise<URLSearchParams> = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
