"use client";

import { DatePicker } from "@/components/date-picker";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import { XIcon } from "lucide-react";
import { ReactElement } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useCreateTask } from "../api/use-create-task";
import { createTaskSchema } from "../schemas";
import { TaskStatus } from "../types";
import { statusIconMap } from "./kanban/kanban-column-header";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
}

export const CreateTaskForm: ({
  onCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) => ReactElement = ({
  onCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) => {
  const workspaceId: string = useWorkspaceId();
  const projectId: string = useProjectId();
  const { mutate, isPending } = useCreateTask();

  const form: UseFormReturn<
    z.infer<typeof createTaskSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
      projectId: projectId || undefined,
    },
  });

  const onSubmit: (values: z.infer<typeof createTaskSchema>) => void = (
    values: z.infer<typeof createTaskSchema>
  ) => {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: (): void => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new Task</CardTitle>
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
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      defaultValue={field.value ?? "none"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value="none">
                          <div className="flex items-center gap-x-2">
                            <XIcon className="size-6 rounded-full border border-neutral-300 transition" />
                            Unassigned
                          </div>
                        </SelectItem>
                        <SelectSeparator />
                        {memberOptions.map(
                          (member): ReactElement => (
                            <SelectItem
                              key={member.id}
                              value={member.id}
                            >
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar
                                  name={member.name}
                                  className="size-6"
                                />
                                {member.name}
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
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
                            (project): ReactElement => (
                              <SelectItem
                                key={project.id}
                                value={project.id}
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
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
