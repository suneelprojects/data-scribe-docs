import { Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CodeBlock } from "./CodeBlock";

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language: string; code: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "text";
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({ type: "code", language, code: code.join("\n") });
      continue;
    }
    const heading = line.match(/^(##|###)\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 2 | 3, text: heading[2].trim() });
      index += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, "").trim());
        index += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }
    const unordered = /^[-*]\s+/.test(line);
    const ordered = /^\d+\.\s+/.test(line);
    if (unordered || ordered) {
      const items: string[] = [];
      const matcher = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (index < lines.length && matcher.test(lines[index])) {
        items.push(lines[index].replace(matcher, "").trim());
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }
    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(?:```|##\s|###\s|>\s?|[-*]\s+|\d+\.\s+)/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}

function inline(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = link[2].trim();
        if (href.startsWith("/")) {
          return (
            <Link key={index} to={href} className="text-accent underline underline-offset-4">
              {link[1]}
            </Link>
          );
        }
        if (/^https:\/\//i.test(href)) {
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer">
              {link[1]}
            </a>
          );
        }
      }
      return <Fragment key={index}>{part}</Fragment>;
    });
}

function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ArticleMarkdown({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);
  return (
    <div className="prose-doc prose-article">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const id = headingId(block.text);
          return block.level === 2 ? (
            <h2 key={`${id}-${index}`} id={id}>
              {inline(block.text)}
            </h2>
          ) : (
            <h3 key={`${id}-${index}`} id={id}>
              {inline(block.text)}
            </h3>
          );
        }
        if (block.type === "paragraph") return <p key={index}>{inline(block.text)}</p>;
        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="my-6 border-l-2 border-accent bg-muted/45 px-5 py-4 text-muted-foreground"
            >
              {inline(block.text)}
            </blockquote>
          );
        }
        if (block.type === "code") {
          const language =
            block.language === "python" || block.language === "bash" ? block.language : "text";
          return (
            <div key={index} className="not-prose my-7">
              <CodeBlock code={block.code} language={language} showLineNumbers />
            </div>
          );
        }
        const List = block.ordered ? "ol" : "ul";
        return (
          <List key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{inline(item)}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
