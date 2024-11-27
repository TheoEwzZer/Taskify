import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, ListIcon, UnderlineIcon } from "lucide-react";
import { ReactElement } from "react";

interface MenuBarProps {
  editor: Editor | null;
}

export default function MenuBar({
  editor,
}: Readonly<MenuBarProps>): ReactElement | null {
  if (!editor) {
    return null;
  }

  return (
    <div className="mb-2 flex gap-2">
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "primary" : "outline"}
        onClick={(): boolean => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("italic") ? "primary" : "outline"}
        onClick={(): boolean => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("underline") ? "primary" : "outline"}
        onClick={(): boolean => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bulletList") ? "primary" : "outline"}
        onClick={(): boolean => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
