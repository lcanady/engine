import styled from "@emotion/styled";
import React from "react";
import MD from "./MD";

const Wrapper = styled.div`
  margin-top: 16px;
  margin-left: 16px;

  h2 {
    color: white;
    font-family: "Roboto Mono";
    font-size: 0.85rem;
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
  font-family: "Roboto Mono";
  width: calc(100% / 4);
  margin: 4px 0;
  color: ${({ color }) => (color ? color : " white")};
`;
type Topic = {
  name: string;
  help: boolean;
};

interface HelpTopicsProps {
  topics: Topic[];
}

export const HelpTopics: React.FC<HelpTopicsProps> = ({ topics }) => {
  return (
    <Wrapper>
      <h2>HELP</h2>
      <p>Help is available for the following topics:</p>
      <HelpList>
        {topics.map((topic, idx) =>
          topic.help ? (
            <HelpItem key={idx}>{topic.name}</HelpItem>
          ) : (
            <HelpItem color="red" key={idx}>
              {topic.name}
            </HelpItem>
          )
        )}
      </HelpList>
      <p>{"Type '+help <topic>' for more help."}</p>
    </Wrapper>
  );
};

interface Entry {
  title: string;
  body: string;
  category: string;
}

interface HelpTopicProps {
  topic: Entry;
}

export const HelpTopic: React.FC<HelpTopicProps> = ({ topic }) => {
  return (
    <Wrapper>
      <h2>HELP&nbsp;{topic.title}</h2>
      <br />
      <MD text={topic.body} />
      <br />
    </Wrapper>
  );
};
