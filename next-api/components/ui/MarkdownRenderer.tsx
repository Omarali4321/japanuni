import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const customComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className="text-3xl font-bold text-ink-900 dark:text-ink-100 mt-8 mb-4 scroll-mt-20 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className="text-2xl font-semibold text-ink-900 dark:text-ink-100 mt-10 mb-4 scroll-mt-20">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="text-xl font-semibold text-ink-900 dark:text-ink-100 mt-8 mb-3 scroll-mt-20">
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className="text-lg font-semibold text-ink-900 dark:text-ink-100 mt-6 mb-2 scroll-mt-20">
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="text-base leading-relaxed text-ink-800/80 dark:text-ink-50/80 mb-4">
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc list-inside space-y-2 text-ink-800/80 dark:text-ink-50/80 mb-4 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal list-inside space-y-2 text-ink-800/80 dark:text-ink-50/80 mb-4 ml-4">
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="leading-relaxed">
      {children}
    </li>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <strong {...props} className="font-semibold text-ink-900 dark:text-ink-100">
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className="italic text-ink-800/80 dark:text-ink-50/80">
      {children}
    </em>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} className="bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-ink-100 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className="bg-ink-100 dark:bg-ink-900 text-ink-900 dark:text-ink-100 p-4 rounded-xl overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} className="border-l-4 border-indigo-500 pl-4 italic text-ink-700 dark:text-ink-300 my-4">
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-500 hover:text-indigo-600 underline underline-offset-2 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table {...props} className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead {...props} className="bg-ink-100 dark:bg-ink-800">
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props}>{children}</tbody>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} className="border border-ink-200 dark:border-ink-700 px-3 py-2 font-semibold text-left text-ink-900 dark:text-ink-100">
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="border border-ink-200 dark:border-ink-700 px-3 py-2 text-ink-800/80 dark:text-ink-50/80">
      {children}
    </td>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props}>{children}</tr>
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className="border-ink-200 dark:border-ink-700 my-8" />
  ),
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-ink max-w-none dark:prose-invert">
      <ReactMarkdown
        components={customComponents}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}