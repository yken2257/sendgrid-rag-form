import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map(token => token.raw);
}

const CustomLink = ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => {
  return (
    <a className='text-blue-600' href={href} target='_blank' rel='noopener noreferrer'>{children}</a>
  );
};

const CustomBulletList = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <ul className='list-disc list-inside'>{children}</ul>
  );
}

const CustomNumberedList = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <ol className='list-decimal list-inside'>{children}</ol>
  );
}

const CustomCodeBlock = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <pre className='bg-gray-100 p-4 rounded-md'>{children}</pre>
  );
}

const CustomInlineCode = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <code className='bg-gray-100 p-1 rounded-md'>{children}</code>
  );
}


const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown
      components={{
        a: CustomLink,
        ul: CustomBulletList,
        ol: CustomNumberedList,
        pre: CustomCodeBlock,
        code: CustomInlineCode,
      }}
    >{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
  ({ content }: { content: string; }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`block_${index}`} />
    ));
  },
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';