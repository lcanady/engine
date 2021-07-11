import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

interface Props {
  text: string;
}

const MD: React.FC<Props> = ({ text }) => {
  return <ReactMarkdown remarkPlugins={[gfm]}>{text}</ReactMarkdown>;
};

export default MD;
