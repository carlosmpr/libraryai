/* eslint-disable react/prop-types */
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css/github-markdown.css';

const MarkDownPreview = ({ selectedFileContent }) => {
    const MarkdownComponents = {
        code({  inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <SyntaxHighlighter
                    style={materialDark}
                    PreTag="div"
                    language={match[1]}
                    // eslint-disable-next-line react/no-children-prop
                    children={String(children).replace(/\n$/, "")}
                    {...props}
                />
            ) : (
                <code className={className ? className : ""} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <div className="markdown-body w-full h-full bg-base-200 overflow-y-scroll p-10">
            <h2>File Preview</h2>
            <Markdown
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={MarkdownComponents}
            >
                {selectedFileContent}
            </Markdown>
        </div>
    );
};

export default MarkDownPreview;
