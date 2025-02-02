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
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckIcon, ChevronsUpDown, UserIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../schemas";
import { DateItem, Project } from "../types";
import { ProjectDatesComp } from "./project-dates";

interface CreateProjectFormProps {
  onCancel?: () => void;
  memberOptions: Member[];
  labelOptions: string[];
}

export const CreateProjectForm: ({
  onCancel,
  memberOptions,
  labelOptions,
}: CreateProjectFormProps) => ReactElement = ({
  onCancel,
  memberOptions,
  labelOptions,
}: CreateProjectFormProps) => {
  const workspaceId: string = useWorkspaceId();
  const router: AppRouterInstance = useRouter();
  const { mutate, isPending } = useCreateProject();

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
    z.infer<typeof createProjectSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      assigneeIds: [],
      dates: [],
    },
  });

  const onSubmit: (values: z.infer<typeof createProjectSchema>) => void = (
    values: z.infer<typeof createProjectSchema>
  ) => {
    const finalValues = {
      ...values,
      workspaceId,
    };

    mutate(
      { json: finalValues },
      {
        onSuccess: ({ data }: { data: Project }): void => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  const handleAssigneeChange = (assigneeId: string) => {
    const currentAssignees = form.getValues("assigneeIds") || [];
    if (currentAssignees.includes(assigneeId)) {
      form.setValue(
        "assigneeIds",
        currentAssignees.filter((id) => id !== assigneeId)
      );
    } else {
      form.setValue("assigneeIds", [...currentAssignees, assigneeId]);
    }
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
