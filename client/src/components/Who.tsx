import styled from "@emotion/styled";
import { Cell, Header, HeaderRow, Row, Table, TableTitle } from "./Tables";

const Wrapper = styled.div`
  width: calc(100% -8px);
  margin-left: 8px;
`;

interface List {
  name: string;
  doing: string;
  idle: string;
}

interface WhoProps {
  list: List[];
}

export const Who: React.FC<WhoProps> = ({ list }) => {
  return (
    <Wrapper>
      <Table>
        <TableTitle>WHO</TableTitle>
        <HeaderRow>
          <Header width="40%">Name</Header>
          <Header width="10%">Idle</Header>
          <Header width="50%">Doing</Header>
        </HeaderRow>
        {list &&
          list.map((player, idx) => {
            return (
              <Row key={idx}>
                <Cell width="40%" style={{ color: " #77ABC0" }}>
                  {player.name}
                </Cell>
                <Cell width="10%">{player.idle}</Cell>
                <Cell width="50%">{player.doing}</Cell>
              </Row>
            );
          })}
      </Table>
      <p style={{ marginTop: "8px" }}>Players Connected: {list.length}</p>
    </Wrapper>
  );
};
