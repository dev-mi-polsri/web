'use client'

import { TextStyleKit } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { MenuBar } from './richtext.menu-bar'
import { EditorContextMenu } from './richtext.context-menu'
import { Editor, JSONContent } from '@tiptap/core'

// Define the extensions to be used in the editor
const extensions = [TextStyleKit, StarterKit]

/// Define editor styles
const editorClassName = [
  // Main editor styles
  'rounded-md bg-background text-sm leading-6 outline-none',
  // Typography styles for <p>
  '[&_p]:my-2',
  // Typography styles for <ul>
  '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6',
  // Typography styles for <ol>
  '[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6',
  // Typography styles for various elements
  '[&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight',
  // Typography styles for <h2>
  '[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight',
  // Typography styles for <h3>
  '[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight',
  // Typography styles for <code>, <pre>, <blockquote>, and <hr>
  '[&_code]:rounded [&_code]:bg-foreground/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]',
  '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-foreground/15 [&_pre]:bg-foreground/5 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-foreground/20 [&_blockquote]:pl-4 [&_blockquote]:italic',
  '[&_hr]:my-6 [&_hr]:border-foreground/15',
].join(' ')

interface IEditorProps {
  onBlur?: (content: JSONContent) => void
  onUpdate?: (content: JSONContent) => void
}

export default function RichTextEditor({onBlur, onUpdate}: IEditorProps) {

  function handleBlur(editor: Editor) {
    onBlur?.(editor.getJSON())
  }

  function handleUpdate(editor: Editor) {
    onUpdate?.(editor.getJSON())
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    editorProps: {
      attributes: {
        class: editorClassName,
      },
    },
    onBlur: ({ editor }) => handleBlur(editor),
    onUpdate : ({ editor }) => handleUpdate(editor),
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That's a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
      </p>
      <pre><code class="language-css">body {
        display: none;
      }</code></pre>
      <p>
        I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that's amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
`,
  })

  return editor ? (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <MenuBar editor={editor} />
      <EditorContextMenu editor={editor}>
        <EditorContent editor={editor} />
      </EditorContextMenu>
    </div>
  ) : null
}
