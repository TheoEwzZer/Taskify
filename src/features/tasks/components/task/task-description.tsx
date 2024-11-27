import { DottedSeparator } from "@/components/dotted-separator";
import MenuBar from "@/components/menu-bar";
import { Button } from "@/components/ui/button";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PencilIcon, XIcon } from "lucide-react";
import { ReactElement, useState } from "react";
import { useUpdateTask } from "../../api/use-update-task";
import { Task } from "../../types";

export const TaskDescription = ({ task }: { task: Task }): ReactElement => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: task.description ?? "",
    editable: isEditing,
  });

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    const content: string | undefined = editor?.getHTML();
    mutate(
      {
        json: { description: content },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          editor?.setEditable(false);
        },
      }
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={(): void => {
            setIsEditing((prev: boolean): boolean => !prev);
            editor?.setEditable(!isEditing);
          }}
        >
          {isEditing ? <XIcon /> : <PencilIcon />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      <div className="prose dark:prose-invert max-w-none">
        {isEditing && <MenuBar editor={editor} />}
        <EditorContent
          editor={editor}
          className="min-h-[100px] rounded-md border p-2"
        />
        {isEditing && (
          <Button
            size="sm"
            className="ml-auto mt-4 w-fit"
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}
        {!task.description && !isEditing && (
          <span className="text-muted-foreground">No description set</span>
        )}
      </div>
    </div>
  );
};
