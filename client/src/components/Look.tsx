import styled from "@emotion/styled";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Container = styled.div`
  margin: 16px 0;
  hr {
    margin-bottom: 16px;
    border: 1px rgba(255, 255, 255, 0.2) solid;
  }
`;

interface ImageProps {
  url: string;
}

const Image = styled.div<ImageProps>`
  width: 100%;
  height: 30vh;
  margin: 16px 0;
  background: url(${({ url }) => url});
  background-position: center;
  background-size: cover;
`;

interface Props {
  ctx: {
    msg: string;
    data: { [key: string]: any };
    [key: string]: any;
  };
}

const Look: React.FC<Props> = ({ ctx }) => {
  const { avatar } = ctx.data;
  return (
    <Container>
      {avatar && <Image url={avatar} />}

      <ReactMarkdown remarkPlugins={[remarkGfm]}>{ctx.msg}</ReactMarkdown>
    </Container>
  );
};

export default Look;
