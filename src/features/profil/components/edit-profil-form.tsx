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
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { ReactElement, RefObject, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useUpdateProfil } from "../api/use-update-profil";
import { editProfilSchema } from "../schemas";

interface EditProfilFormProps {
  onCancel?: () => void;
  initialValues: Models.User<Models.Preferences>;
}

export const EditProfilForm: ({
  onCancel,
  initialValues,
}: EditProfilFormProps) => ReactElement = ({
  onCancel,
  initialValues,
}: EditProfilFormProps) => {
  const { mutate, isPending } = useUpdateProfil();

  const inputRef: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);

  const form: UseFormReturn<
    z.infer<typeof editProfilSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof editProfilSchema>>({
    resolver: zodResolver(editProfilSchema),
    defaultValues: {
      ...initialValues,
      avatar: initialValues.prefs?.avatar ?? "none",
    },
  });

  const onSubmit: (values: z.infer<typeof editProfilSchema>) => void = (
    values: z.infer<typeof editProfilSchema>
  ) => {
    const finalValues = {
      ...values,
      avatar: values.avatar instanceof File ? values.avatar : "none",
    };

    mutate({ form: finalValues });
  };

  const handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = e.target.files?.[0];

    if (file) {
      form.setValue("avatar", file);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
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
                      <FormLabel>Profil Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter profil name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value && field.value !== "none" ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              alt="Profil Image"
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
                          <p className="text-sm">Profil Icon</p>
                          <p className="text-muted-foreground text-sm">
                            JPG, PNG, SVG or JPEG, max 48KB
                          </p>
                          <input
                            className="hidden"
                            accept=".jpg, .png, .svg, .jpeg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                            type="file"
                          />
                          {field.value && field.value !== "none" ? (
                            <Button
                              type="button"
                              size="xs"
                              variant="destructive"
                              className="mt-2 w-fit"
                              disabled={isPending}
                              onClick={() => {
                                field.onChange("none");
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
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
