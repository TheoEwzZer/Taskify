"use client";

import { DatePicker } from "@/components/date-picker";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  Check,
  CheckIcon,
  ChevronsUpDown,
  UserIcon,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useConfirm } from "../../../hooks/use-confirm";
import { useDeleteProject } from "../api/use-delete-project";
import { useUpdateProject } from "../api/use-update-project";
import { updateProjectSchema } from "../schemas";
import { DateItem, DatesString, Project } from "../types";
import { ProjectDatesComp } from "./project-dates";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
  memberOptions: Member[];
  labelOptions: string[];
}

export const EditProjectForm: ({
  onCancel,
  initialValues,
  memberOptions,
  labelOptions,
}: EditProjectFormProps) => ReactElement = ({
  onCancel,
  initialValues,
  memberOptions,
  labelOptions,
}: EditProjectFormProps) => {
  const router: AppRouterInstance = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action cannot be undone.",
    "destructive"
  );

  const inputRef: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);
  const buttonRef: RefObject<HTMLButtonElement | null> =
    useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(0);

  const updateButtonWidth = () => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateButtonWidth();
    window.addEventListener("resize", updateButtonWidth);
    return () => {
      window.removeEventListener("resize", updateButtonWidth);
    };
  }, []);

  const form: UseFormReturn<
    z.infer<typeof updateProjectSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      startDate: initialValues.startDate
        ? new Date(initialValues.startDate)
        : undefined,
      endDate: initialValues.endDate
        ? new Date(initialValues.endDate)
        : undefined,
      label: initialValues.label ?? null,
      assigneeIds: initialValues.assigneeIds.map((id: string): string => id),
      dates:
        initialValues.dates?.map(
          (date: DatesString): DateItem => ({
            ...date,
            date: new Date(date.date),
          })
        ) || [],
    },
  });

  const handleAssigneeChange = (assigneeId: string): void => {
    const currentAssignees: string[] = form.getValues("assigneeIds") || [];
    if (currentAssignees.includes(assigneeId)) {
      form.setValue(
        "assigneeIds",
        currentAssignees.filter((id: string): boolean => id !== assigneeId)
      );
    } else {
      form.setValue("assigneeIds", [...currentAssignees, assigneeId]);
    }
  };

  const handleDelete: () => Promise<void> = async () => {
    const ok: unknown = await confirmDelete();

    if (!ok) {
      return;
    }

    deleteProject(
      { param: { projectId: initialValues.$id } },
      {
        onSuccess: (): void => {
          window.location.href = `/workspaces/${initialValues.workspaceId}`;
        },
      }
    );
  };

  const onSubmit: (values: z.infer<typeof updateProjectSchema>) => void = (
    values: z.infer<typeof updateProjectSchema>
  ) => {
    mutate({ json: values, param: { projectId: initialValues.$id } });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel ||
              ((): void =>
                router.push(
                  `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                ))
            }
          >
            <ArrowLeftIcon className="mr-1 size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter project name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePicker {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DatePicker {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assigneeIds"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Assignees</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            ref={buttonRef}
                            variant="outline"
                            size="sm"
                            className="text-muted-foreground h-12 justify-start font-normal"
                          >
                            {field.value && field.value.length > 0 ? (
                              <div className="flex items-center gap-x-2">
                                <UserIcon className="h-4 w-4" />
                                <span>{field.value.length} Assignees</span>
                              </div>
                            ) : (
                              "Select Assignees"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0"
                          align="start"
                          style={{ width: buttonWidth }}
                        >
                          <Command>
                            <CommandInput placeholder="Assignees" />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup>
                                {memberOptions.map(
                                  (option: Member): ReactElement => {
                                    const isSelected: boolean = field.value
                                      ? field.value.includes(option.$id)
                                      : false;
                                    return (
                                      <CommandItem
                                        key={option.$id}
                                        onSelect={(): void => {
                                          handleAssigneeChange(option.$id);
                                        }}
                                      >
                                        <div
                                          className={cn(
                                            "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                                            isSelected
                                              ? "bg-primary text-primary-foreground"
                                              : "opacity-50 [&_svg]:invisible"
                                          )}
                                        >
                                          <CheckIcon
                                            className={cn("h-4 w-4")}
                                          />
                                        </div>
                                        <MemberAvatar
                                          member={option}
                                          className="mb-1.5"
                                        />
                                        <span>{option.name}</span>
                                      </CommandItem>
                                    );
                                  }
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Label</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "group relative h-12 w-auto justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? labelOptions.find(
                                    (label: string): boolean =>
                                      label === field.value
                                  )
                                : "Select label"}
                              <div className="flex items-center gap-2">
                                <ChevronsUpDown className="opacity-50" />
                              </div>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          style={{ width: buttonWidth }}
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search label..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No label found.</CommandEmpty>
                              <CommandGroup>
                                {labelOptions.map(
                                  (label: string): ReactElement => (
                                    <CommandItem
                                      value={label}
                                      key={label}
                                      onSelect={(): void => {
                                        if (field.value === label) {
                                          form.setValue("label", null);
                                        } else {
                                          form.setValue("label", label);
                                        }
                                      }}
                                    >
                                      {label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          label === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  )
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Important Dates</FormLabel>
                      <FormControl>
                        <ProjectDatesComp
                          dates={field.value}
                          onChange={(newDates: DateItem[] | undefined): void =>
                            field.onChange(newDates)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-muted-foreground text-sm">
              Deleting a project is irreversible and will remove all associated
              data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 ml-auto w-fit"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
