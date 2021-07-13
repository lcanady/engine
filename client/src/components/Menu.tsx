import styled from "@emotion/styled";
import React from "react";

const MenuContainer = styled.ul`
  list-style: none;
`;

interface MenuItemProps {
  active?: boolean;
}

export const MenuItem = styled.li<MenuItemProps>`
  font-family: "Roboto Mono";
  font-size: 0.85rem;
  margin: 8px 0;
  margin-left: ${({ active }) => active && "-16px"};
  color: ${({ active }) => (active ? "#77ABC0" : "white")};

  &:before {
    content: "${({ active }) => (active ? "> " : "")}";
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    border-left: 1px solid #77abc0;
    margin-left: 16px;
    padding-left: 32px;
    display: ${({ active }) => (active ? "block" : "none")};
  }
`;

interface Props {}

export const Menu: React.FC<Props> = ({ children }) => {
  return <MenuContainer>{children}</MenuContainer>;
};
