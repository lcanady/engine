import styled from "@emotion/styled";

export const Table = styled.div`
  border: none;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeaderRow = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 4px;
`;

export const TableBody = styled.div`
  div:nth-child(2) {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

interface HeaderProps {
  width: string;
  align?: string;
}

export const Header = styled.div<HeaderProps>`
  color: white;
  font-family: "Roboto Mono", monospace;
  font-weight: normal;
  font-size: 0.85rem;
  text-align: ${({ align }) => (align ? align : "left")};
  width: ${({ width }) => width};
`;

export const Row = styled.div`
  display: flex;
`;

interface CellProps {
  width: string;
  align?: string;
}

export const Cell = styled.div<CellProps>`
  font-family: "Roboto Mono";
  font-size: 0.85rem;
  padding: 4px 0;
  text-align: ${({ align }) => (align ? align : "left")};
  width: ${({ width }) => width};
  color: white;
`;
