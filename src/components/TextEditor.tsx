"use client";

import { useCheckRole } from "@/hooks/useCheckRole";
import { ChapterDocument } from "@/models/chapter";
import { getMeetingTemplates } from "@/utils/templates";
import { User } from "@clerk/nextjs/server";
import { Editor } from "@tinymce/tinymce-react";
import { InitOptions } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";
import { useCallback, useMemo } from "react";

type Props = {
  meetingDocType?: "minutes" | "notes" | "history";
  initialContent?: string;
  templateDataChapter: ChapterDocument;
  matron: User;
};

function TextEditor({
  meetingDocType,
  initialContent,
  templateDataChapter,
  matron,
}: Props) {
  const API_KEY = process.env.NEXT_PUBLIC_TINY_MCE_API_KEY;
  const checkRoleClient = useCheckRole();

  const editorInit: InitOptions = useMemo(
    () => ({
      height: 500,
      width: "100%",
      menubar: true,
      plugins: "lists link table code insertdatetime",
      toolbar: `undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | insertdatetime | ${
        meetingDocType === "minutes" && "customTemplateDropdown"
      }`,
      setup: (editor) => {
        // Add custom button
        editor.ui.registry.addMenuButton("customTemplateDropdown", {
          text: "Templates",
          fetch: (callback) => {
            const items = getMeetingTemplates(editor, {
              chapter: templateDataChapter,
              matron,
            });
            //@ts-ignore
            callback(items);
          },
        });
      },
    }),
    [meetingDocType, templateDataChapter, matron]
  );

  const RealtimeEditor = useCallback(
    () => (
      <Editor
        apiKey={API_KEY}
        init={editorInit}
        onInit={(_evt, editor) =>
          console.log("Editor is ready to use!", editor)
        }
        textareaName="meetingDoc"
        initialValue={initialContent}
        disabled={!checkRoleClient(["secretary", "grand-administrator"])}
      />
    ),
    [editorInit, API_KEY, initialContent, checkRoleClient]
  );

  return <RealtimeEditor />;
}

export default TextEditor;
