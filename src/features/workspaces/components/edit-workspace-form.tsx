"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, RefObject, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useConfirm } from "../../../hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";
import { InviteMembersCard } from "./invite-members-card";
import { WorkspaceLabels } from "./workspace-labels";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm: ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => ReactElement = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const router: AppRouterInstance = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone.",
    "destructive"
  );

  const inputRef: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);

  const form: UseFormReturn<
    z.infer<typeof updateWorkspaceSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
      labels: Array.isArray(initialValues.labels) ? initialValues.labels : [],
    },
  });

  const handleDelete: () => Promise<void> = async () => {
    const ok: unknown = await confirmDelete();

    if (!ok) {
      return;
    }

    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: (): void => {
          window.location.href = "/";
        },
      }
    );
  };

  const onSubmit: (values: z.infer<typeof updateWorkspaceSchema>) => void = (
    values: z.infer<typeof updateWorkspaceSchema>
  ) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
      labels: values.labels,
    };
    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
  };

  const handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
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
              ((): void => router.push(`/workspaces/${initialValues.$id}`))
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
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter workspace name"
                        />
                      </FormControl>
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
                              alt="Workspace Image"
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
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-muted-foreground text-sm">
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
                <FormField
                  control={form.control}
                  name="labels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Labels</FormLabel>
                      <FormControl>
                        <WorkspaceLabels
                          labels={field.value}
                          onChange={(newLabels: string[]): void =>
                            field.onChange(newLabels)
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
      <InviteMembersCard workspace={initialValues} />
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-muted-foreground text-sm">
              Deleting a workspace is irreversible and will remove all
              associated data. If you are not an admin, you will only leave the
              workspace.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 ml-auto w-fit"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Delete or Leave Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
