const URL_SPLIT_RE = /(https?:\/\/[^\s]+)/g;

/** Turns bare URLs in plain text into tappable links. Safe in Server Components. */
export function linkify(text: string): React.ReactNode[] {
  return text.split(URL_SPLIT_RE).map((part, i) =>
    part.startsWith("http://") || part.startsWith("https://") ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}
