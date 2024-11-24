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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { Project } from "@/features/projects/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import { CheckIcon, UserIcon } from "lucide-react";
import { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useUpdateTask } from "../api/use-update-task";
import { editTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";
import { statusIconMap } from "./kanban/kanban-column-header";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: Project[];
  memberOptions: Member[];
  initialValues: Task;
}

export const EditTaskForm: ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => ReactElement = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}) => {
  const projectId: string = useProjectId();
  const { mutate, isPending } = useUpdateTask();
  const [filteredMembers, setFilteredMembers] =
    useState<Member[]>(memberOptions);

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
    z.infer<typeof editTaskSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(
      editTaskSchema.omit({ workspaceId: true, description: true })
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
      assigneeIds: initialValues.assigneeIds.map((id: string): string => id),
    },
  });

  useEffect((): void => {
    const selectedProjectId: string = form.watch("projectId") || projectId;
    const selectedProject: Project | undefined = projectOptions.find(
      (project: Project): boolean => project.$id === selectedProjectId
    );

    if (selectedProject) {
      const assigneeIds: string[] = selectedProject.assigneeIds;
      const filtered: Member[] = memberOptions.filter(
        (member: Member): boolean => assigneeIds.includes(member.$id)
      );
      setFilteredMembers(filtered);

      const currentAssigneeIds: string[] = form.getValues("assigneeIds") || [];
      const updatedAssigneeIds: string[] = currentAssigneeIds.filter(
        (id: string): boolean => assigneeIds.includes(id)
      );
      form.setValue("assigneeIds", updatedAssigneeIds);
    } else {
      setFilteredMembers(memberOptions);
    }
  }, [form.watch("projectId"), projectId, projectOptions, memberOptions]);

  const onSubmit: (values: z.infer<typeof editTaskSchema>) => void = (
    values: z.infer<typeof editTaskSchema>
  ) => {
    mutate(
      { json: values, param: { taskId: initialValues.$id } },
      {
        onSuccess: (): void => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

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

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a Task</CardTitle>
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
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Task name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
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
                          className="h-12 justify-start font-normal text-muted-foreground"
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
                              {filteredMembers.map(
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
                                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                          isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "opacity-50 [&_svg]:invisible"
                                        )}
                                      >
                                        <CheckIcon className={cn("h-4 w-4")} />
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          <div className="flex items-center gap-x-2">
                            {statusIconMap[TaskStatus.BACKLOG]} Backlog
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          <div className="flex items-center gap-x-2">
                            {statusIconMap[TaskStatus.IN_PROGRESS]} In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          <div className="flex items-center gap-x-2">
                            {statusIconMap[TaskStatus.IN_REVIEW]} In Review
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>
                          <div className="flex items-center gap-x-2">
                            {statusIconMap[TaskStatus.TODO]} To Do
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>
                          <div className="flex items-center gap-x-2">
                            {statusIconMap[TaskStatus.DONE]} Done
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {!projectId && (
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {projectOptions.map(
                            (project: Project): ReactElement => (
                              <SelectItem
                                key={project.$id}
                                value={project.$id}
                              >
                                <div className="flex items-center gap-x-2">
                                  <ProjectAvatar
                                    name={project.name}
                                    image={project.imageUrl}
                                    className="size-6"
                                  />
                                  {project.name}
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Task description"
                        className="resize-none"
                        {...field}
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
  );
};
