import styled from "@emotion/styled";
import React from "react";

import { useContext } from "react";

import { MyContext } from "../store/store";
import Avatar from "./Avatar";
import { InvItem } from "./Look";

const Wrapper = styled.div`
  margin-right: auto;
`;

export const Contents: React.FC = () => {
  return <Wrapper></Wrapper>;
};

const SideWrapper = styled.div`
  z-index: 10;
  width: 300px;
  margin-left: auto;

  h2 {
    font-size: 0.95rem;
    font-weight: normal;
    margin-bottom: 24px;

    margin-top: 125px;
  }
`;

interface ItemProps {}

const Item = styled.div<ItemProps>`
  max-width: 300px;
  display: flex;
  align-items: center;
  margin: 8px 0;
  margin-bottom: 16px;
`;

const Name = styled.p`
  font-size: 0.75rem;
  color: #77abc0;
`;

interface SideContentsProps {
  items: InvItem[];
}

export const SideContents: React.FC<SideContentsProps> = ({ items }) => {
  const { flags } = useContext(MyContext);

  return (
    <SideWrapper>
      <h2>/avatars</h2>
      {items.map((item) => {
        if (item.flags.includes("player")) {
          return (
            <Item>
              <Avatar img={item.avatar || ""} width="32px" height="32px" />
              <Name>{item.name}</Name>
            </Item>
          );
        }

        return false;
      })}
    </SideWrapper>
  );
};
