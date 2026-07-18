// Tiny, dependency-free Python highlighter. Returns HTML string.
// Not perfect — good enough for docs snippets and looks intentional.

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
]);

const BUILTINS = new Set([
  "print", "len", "range", "int", "str", "float", "list", "dict", "set",
  "tuple", "bool", "type", "isinstance", "open", "map", "filter", "sum",
  "min", "max", "abs", "round", "sorted", "reversed", "enumerate", "zip",
  "any", "all", "input", "repr", "id", "hash", "iter", "next", "None",
  "True", "False",
]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlightPython(src: string): string {
  const tokens: string[] = [];
  let i = 0;
  const n = src.length;

  while (i < n) {
    const ch = src[i];

    // comments
    if (ch === "#") {
      let j = i;
      while (j < n && src[j] !== "\n") j++;
      tokens.push(`<span class="tk-comment">${escapeHtml(src.slice(i, j))}</span>`);
      i = j;
      continue;
    }

    // strings (single or double, incl. triple)
    if (ch === '"' || ch === "'") {
      const triple = src.slice(i, i + 3) === ch + ch + ch;
      const quote = triple ? ch + ch + ch : ch;
      let j = i + quote.length;
      while (j < n) {
        if (src[j] === "\\" && !triple) {
          j += 2;
          continue;
        }
        if (src.slice(j, j + quote.length) === quote) {
          j += quote.length;
          break;
        }
        j++;
      }
      tokens.push(`<span class="tk-string">${escapeHtml(src.slice(i, j))}</span>`);
      i = j;
      continue;
    }

    // numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9._eE+\-xXaAbBcCdDfF]/.test(src[j])) j++;
      tokens.push(`<span class="tk-number">${escapeHtml(src.slice(i, j))}</span>`);
      i = j;
      continue;
    }

    // identifiers / keywords / builtins / function calls
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      // peek next non-space for `(`
      let k = j;
      while (k < n && src[k] === " ") k++;
      const isCall = src[k] === "(";
      let cls = "";
      if (KEYWORDS.has(word)) cls = "tk-keyword";
      else if (BUILTINS.has(word)) cls = "tk-builtin";
      else if (isCall) cls = "tk-func";
      if (cls) tokens.push(`<span class="${cls}">${escapeHtml(word)}</span>`);
      else tokens.push(escapeHtml(word));
      i = j;
      continue;
    }

    // operators / punctuation
    if (/[+\-*/%=<>!&|^~,:;()[\]{}.@]/.test(ch)) {
      tokens.push(`<span class="tk-op">${escapeHtml(ch)}</span>`);
      i++;
      continue;
    }

    tokens.push(escapeHtml(ch));
    i++;
  }

  return tokens.join("");
}

export function highlightBash(src: string): string {
  // very simple: highlight leading $ prompts and known commands
  return escapeHtml(src)
    .replace(/^(\s*)(\$)(\s)/gm, '$1<span class="tk-prompt">$2</span>$3')
    .replace(/\b(pip|python|python3|cd|ls|git|npm|bun|export)\b/g, '<span class="tk-keyword">$1</span>');
}
