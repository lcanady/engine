import styled from "@emotion/styled";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Avatar from "../components/Avatar";
import { Cell, Header, HeaderRow, Row, Table } from "./Tables";

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

export interface InvItem {
  name: string;
  desc: string;
  id: string;
  avatar?: string;
  flags: string;
  shortdesc?: string;
  idle?: number;
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

const TextContainer = styled.div`
  h2 {
    margin-top: 16px;
    font-family: "Roboto Mono";
    font-size: 0.9rem;
    color: white;
  }
`;

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
        <h2>Characters</h2>
        <Table>
          <HeaderRow>
            <Header width="40%">Name</Header>
            <Header width="55%">Short Desc</Header>
            <Header width="5%" align="right">
              Idle
            </Header>
          </HeaderRow>
          {ctx.data.items.map((item: InvItem, idx: number) => (
            <Row>
              <Cell width="40%" style={{ color: " #77ABC0" }}>
                {item.name}
              </Cell>
              <Cell width="55%">
                {item?.shortdesc || "Type '+shortdesc <desc>' to set this."}
              </Cell>
              <Cell width="5%" align="right">
                {item.idle}
              </Cell>
            </Row>
          ))}
        </Table>
      </TextContainer>
    </Container>
  );
};

export default Look;
