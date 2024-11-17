"use client";

import { DatePicker } from "@/components/date-picker";
import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { CheckIcon, ImageIcon, UserIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../schemas";
import { Project } from "../types";

interface CreateProjectFormProps {
  onCancel?: () => void;
  memberOptions: Member[];
}

export const CreateProjectForm: ({
  onCancel,
  memberOptions,
}: CreateProjectFormProps) => ReactElement = ({
  onCancel,
  memberOptions,
}: CreateProjectFormProps) => {
  const workspaceId: string = useWorkspaceId();
  const router: AppRouterInstance = useRouter();
  const { mutate, isPending } = useCreateProject();

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const buttonRef: RefObject<HTMLButtonElement> =
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
    },
  });

  const onSubmit: (values: z.infer<typeof createProjectSchema>) => void = (
    values: z.infer<typeof createProjectSchema>
  ) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
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

  const handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
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
                                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                          isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "opacity-50 [&_svg]:invisible"
                                        )}
                                      >
                                        <CheckIcon className={cn("h-4 w-4")} />
                                      </div>
                                      <MemberAvatar member={option} />
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
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="relative size-[72px] overflow-hidden rounded-md">
                          <Image
                            alt="Project Image"
                            fill
                            className="object-cover"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Project Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1MB
                        </p>
                        <input
                          className="hidden"
                          accept=".jpg, .png, .svg, .jpeg"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                          type="file"
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            size="xs"
                            variant="destructive"
                            className="mt-2 w-fit"
                            disabled={isPending}
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="xs"
                            variant="teritary"
                            className="mt-2 w-fit"
                            disabled={isPending}
                            onClick={(): void => inputRef.current?.click()}
                          >
                            Change Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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
