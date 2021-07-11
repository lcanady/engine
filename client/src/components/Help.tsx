import styled from "@emotion/styled";
import React from "react";

const Wrapper = styled.div`
  margin-top: 16px;
  margin-left: 16px;

  h2 {
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
`;
const HelpList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0;
  list-style: none;
`;

interface PropsHelpItem {
  color?: string;
}

const HelpItem = styled.li<PropsHelpItem>`
  font-size: 0.9rem;
  width: calc(100% / 4);
  margin: 4px 0;
  color: ${({ color }) => color && color};
`;
type Topic = {
  name: string;
  help: boolean;
};

interface HelpTopicProps {
  topics: Topic[];
}

export const HelpTopics: React.FC<HelpTopicProps> = ({ topics }) => {
  return (
    <Wrapper>
      <h2>HELP</h2>
      <p>Help is available for the following topics:</p>
      <HelpList>
        {topics.map((topic) =>
          topic.help ? (
            <HelpItem>{topic.name}</HelpItem>
          ) : (
            <HelpItem color="red">{topic.name}</HelpItem>
          )
        )}
      </HelpList>
      <p>{"Type '+help <topic>' for more help."}</p>
    </Wrapper>
  );
};
