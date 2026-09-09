import React, { useCallback, useEffect } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extensions';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';

/**
 * Article editor.
 *
 * Rich text rather than a markdown box, so pasting from another site keeps its
 * bold, headings, lists and links. TipTap parses pasted HTML into its own
 * schema, which drops the source site's fonts, colours and layout — that is
 * deliberate: it keeps the *structure* while your own stylesheet keeps
 * ownership of how it looks.
 */

/**
 * Image with a `placement` attribute, persisted as data-placement so the
 * article stylesheet can float it left/right, widen it, or shrink it.
 */
const PlacedImage = Image.extend({
  // Lets you pick an image up and drop it anywhere else in the article.
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      placement: {
        default: 'full',
        parseHTML: (element) => element.getAttribute('data-placement') || 'full',
        renderHTML: (attributes) => ({ 'data-placement': attributes.placement || 'full' }),
      },
    };
  },
});

const btn =
  'inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded px-1.5 text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40';
const btnActive = 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white';

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep the selection
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={Boolean(active)}
      className={`${btn} ${active ? btnActive : ''}`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-gray-200" />;

/**
 * Does this URL point at an image? Matches a normal file extension, and also
 * Supabase storage object URLs, which carry the extension before a query.
 */
const IMAGE_URL = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif|svg|bmp)(\?\S*)?$/i;

export function isImageUrl(value) {
  return IMAGE_URL.test(value.trim());
}

/** Insert an image straight through ProseMirror, no editor instance needed. */
function insertImageNode(view, src) {
  const type = view.state.schema.nodes.image;
  if (!type) return;
  const node = type.create({ src, alt: '', placement: 'full' });
  view.dispatch(view.state.tr.replaceSelectionWith(node).scrollIntoView());
}

/** Placement choices offered when an image is selected. */
const IMAGE_PLACEMENTS = [
  ['full', 'Full width'],
  ['wide', 'Wide'],
  ['small', 'Small'],
  ['left', 'Float left'],
  ['right', 'Float right'],
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  editorRef,
  onUploadImage,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noreferrer', target: '_blank' },
        },
      }),
      PlacedImage.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write your article…' }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'article-body tiptap-surface',
      },
      // Dropping image files lands them exactly where you dropped them.
      // `moved` means TipTap is repositioning an existing image — leave it be.
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !onUploadImage) return false;
        const files = [...(event.dataTransfer?.files ?? [])].filter((f) =>
          f.type.startsWith('image/'),
        );
        if (!files.length) return false;
        event.preventDefault();
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY });
        onUploadImage(files, at?.pos ?? view.state.selection.from);
        return true;
      },
      handlePaste: (view, event) => {
        // An image file on the clipboard — upload it.
        const files = [...(event.clipboardData?.files ?? [])].filter((f) =>
          f.type.startsWith('image/'),
        );
        if (files.length && onUploadImage) {
          event.preventDefault();
          onUploadImage(files, view.state.selection.from);
          return true;
        }

        // A bare image URL — show the picture rather than a link. Without this
        // the Link extension's autolink turns it into blue underlined text.
        const text = event.clipboardData?.getData('text/plain')?.trim();
        const html = event.clipboardData?.getData('text/html');
        if (text && !html && isImageUrl(text)) {
          event.preventDefault();
          insertImageNode(view, text);
          return true;
        }

        return false;
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  // Track the selected image so the placement bar can reflect and change it.
  const imageState = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e?.isActive('image')
        ? { selected: true, placement: e.getAttributes('image').placement || 'full' }
        : { selected: false, placement: null },
  });

  // Hand the instance up so the image gallery can insert at the cursor.
  useEffect(() => {
    if (editorRef) editorRef.current = editor;
  }, [editor, editorRef]);

  // Reflect an externally-swapped post (picking a different article in the list)
  // without clobbering what is being typed.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || '';
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  const insertImageByUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Image URL')?.trim();
    if (!url) return;
    editor.chain().focus().setImage({ src: url, alt: '', placement: 'full' }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes('link').href ?? '';
    const url = window.prompt('Link URL', previous);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const is = (name, attrs) => editor.isActive(name, attrs);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-1.5 py-1">
        <ToolbarButton
          title="Bold (Ctrl+B)"
          active={is('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic (Ctrl+I)"
          active={is('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Underline (Ctrl+U)"
          active={is('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={is('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Inline code"
          active={is('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Normal text"
          active={is('paragraph') && !is('heading')}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <span className="px-0.5 text-xs font-bold">P</span>
        </ToolbarButton>
        <ToolbarButton
          title="Heading"
          active={is('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Subheading"
          active={is('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Bullet list"
          active={is('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={is('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={is('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Divider line"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Align left" active={is({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton title="Align centre" active={is({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton title="Align right" active={is({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Add link" active={is('link')} onClick={setLink}>
          <Link2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Remove link"
          disabled={!is('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Link2Off size={15} />
        </ToolbarButton>
        <ToolbarButton title="Insert image from a URL" onClick={insertImageByUrl}>
          <ImageIcon size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Undo (Ctrl+Z)"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Redo (Ctrl+Shift+Z)"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={15} />
        </ToolbarButton>

        <span className="ml-auto pr-1 text-[11px] text-gray-400">
          Paste from any site — formatting is kept
        </span>
      </div>

      {/* Appears only while an image is selected. */}
      {imageState?.selected ? (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-blue-200 bg-blue-50 px-2.5 py-1.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
            Image
          </span>
          {IMAGE_PLACEMENTS.map(([key, labelText]) => (
            <button
              key={key}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().updateAttributes('image', { placement: key }).run()}
              className={`rounded border px-2 py-1 text-[11px] font-bold transition ${
                imageState.placement === key
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-blue-200 bg-white text-blue-700 hover:border-blue-600'
              }`}
            >
              {labelText}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().deleteSelection().run()}
            className="ml-auto rounded border border-blue-200 bg-white px-2 py-1 text-[11px] font-bold text-red-600 transition hover:border-red-500 hover:bg-red-50"
          >
            Remove
          </button>
          <span className="w-full text-[11px] text-blue-700/70">
            Drag the image to move it anywhere in the article.
          </span>
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}

/** Insert an uploaded image at the cursor, in one of the article placements. */
export function insertImageIntoEditor(editor, image, placement = 'full') {
  if (!editor) return;
  editor.chain().focus().setImage({ src: image.url, alt: image.name, placement }).run();
}
