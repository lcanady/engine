import styled from "@emotion/styled";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Avatar from "../components/Avatar";

interface ContainerProps {
  player?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${({ player }) => !player && "column"};
  margin: 16px 8px;
  hr {
    margin-bottom: 16px;
    border: 1px rgba(255, 255, 255, 0.2) solid;
  }
`;

interface ImageProps {
  url: string;
}

interface InvItem {
  name: string;
  desc: string;
  id: string;
  avatar: string;
  flags: string;
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
const Link = styled.a`
  p {
    color: #77abc0;
    margin: 8px 0;
  }
`;

const TextContainer = styled.div``;

const Look: React.FC<Props> = ({ ctx }) => {
  const { avatar, flags } = ctx.data;
  return (
    <Container player={!!flags.includes("player")}>
      {avatar && flags.includes("player") ? (
        <Avatar img={avatar} height="60px" width="60px" />
      ) : (
        <Image url={avatar} />
      )}
      <TextContainer>
        <h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {ctx.data.name}
          </ReactMarkdown>
        </h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {ctx.data.desc}
        </ReactMarkdown>
        {ctx.data.items.length && ctx.data.flags.includes("room") ? (
          <p>Contents:</p>
        ) : (
          <br />
        )}
        {ctx.data.items.map((item: InvItem) => (
          <Link href="#" onClick={(ev) => ev.preventDefault()}>
            {
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.name}
              </ReactMarkdown>
            }
          </Link>
        ))}
      </TextContainer>
    </Container>
  );
};

export default Look;
