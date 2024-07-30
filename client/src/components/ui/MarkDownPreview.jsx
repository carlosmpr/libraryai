


import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css/github-markdown.css';

const MarkDownPreview = ({ selectedFileContent, customStyle='px-10 pt-10 pb-32' }) => {
    // Function to remove the front matter
    const removeFrontMatter = (content) => {
        return content.replace(/---\n[\s\S]*?title:.*\n[\s\S]*?description:.*\n[\s\S]*?pubDate:.*\n[\s\S]*?author:.*\n[\s\S]*?---\n/, '');
    };

    // Clean the selected file content
    const cleanedContent = removeFrontMatter(selectedFileContent);

    const MarkdownComponents = {
        code({ inline, className, children, ...props }) {
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
        <div className={`markdown-body w-full h-full bg-white border border-2 border-black overflow-y-scroll  ${customStyle}`}>
            <Markdown
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={MarkdownComponents}
            >
                {cleanedContent}
            </Markdown>
            
        </div>
    );
};

export default MarkDownPreview;
