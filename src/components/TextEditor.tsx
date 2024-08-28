"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { InitOptions } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";

const TextEditor = () => {
  const editorInit: InitOptions = {
    height: 500,
    width: "100%",
    menubar: true,
    plugins: "lists link image table code",
    toolbar:
      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | customTemplateDropdown",
    setup: (editor) => {
      // Add custom button
      editor.ui.registry.addMenuButton("customTemplateDropdown", {
        text: "Templates",
        fetch: (callback) => {
          const items = [
            {
              type: "menuitem",
              text: "Template 1",
              onAction: () => {
                editor.resetContent();
                editor.insertContent("<p>Template 1 content</p>");
              },
            },
            {
              type: "menuitem",
              text: "Template 2",
              onAction: () => {
                editor.resetContent();
                editor.insertContent("<p>Template 2 content</p>");
              },
            },
          ];
          //@ts-ignore
          callback(items);
        },
      });
    },
  };

  const API_KEY = process.env.NEXT_PUBLIC_TINY_MCE_API_KEY;

  return (
    <Editor
      apiKey={API_KEY}
      init={editorInit}
      onInit={(_evt, editor) => console.log("Editor is ready to use!", editor)}
    />
  );
};

export default TextEditor;
