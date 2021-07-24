import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { MyContext } from "../store/store";
import InputBox from "../components/Input";
import PoseBox from "../components/PoseBox";
import { HelpTopics } from "../components/Help";
import Look from "../components/Look";
import { Layout } from "../components/Layout";

const Container = styled.div`
  display: block;
  width: 960px;
  height: 100vh;

  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
`;

interface OutputProps {
  ht: number;
  wHt: number;
}
const Output = styled.div<OutputProps>`
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: column-reverse;
  flex-shrink: 1;
  top: 220px;
  width: 960px;

  height: calc(
    ${({ wHt }) => {
        if (wHt <= 750) return "63%";
        if (wHt <= 850) return "65%";
        if (wHt <= 900) return "68%";
        if (wHt <= 1120) return "73%";

        return "76%";
      }} - ${({ ht }) => ht}px
  );

  overflow-y: overlay;
  * {
    overflow-anchor: none;
  }

  @media only screen and (max-width: 1024px) {
    width: 100%;
    padding: 0 24px;
  }

  h2 {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  blockquote {
    padding: 4px 0;
    padding-left: 16px;

    border-left: 1px solid rgba(255, 255, 255, 0.7);
  }

  pre {
    background-color: rgba(15, 12, 35, 0.5);
    font-family: "Roboto Mono";
    font-size: 0.85rem;
    backdrop-filter: blur(5px);
    padding: 8px;
  }
`;

const SysMsg = styled.div`
  font-family: "Roboto Mono";
  font-size: 0.85rem;
  margin-left: 8px;
`;

const Client = () => {
  const { msgs, addMsg, connect, socket } = useContext(MyContext);
  const [height, setHeight] = useState(68);
  const [wHeight, setWHeight] = useState(window.innerHeight);

  useEffect(() => {
    if (!socket) connect!();
  }, [connect, socket]);

  useEffect(() => {
    addMsg!(JSON.parse(sessionStorage.getItem("msgs") || "[]"));
  }, [addMsg]);

  useEffect(() => {
    if (msgs) sessionStorage.setItem("msgs", JSON.stringify(msgs));
  }, [msgs]);

  useEffect(
    () =>
      window.addEventListener("resize", () => setWHeight!(window.innerHeight)),
    []
  );

  return (
    <Layout index={0}>
      <Container>
        <Output ht={height} wHt={wHeight}>
          {msgs?.map((ctx, i) => {
            switch (ctx.data.type) {
              case "look":
                return <Look ctx={ctx} key={i} />;
              case "say":
                return <PoseBox ctx={ctx} key={i} />;
              case "pose":
                return <PoseBox ctx={ctx} key={i} />;
              case "helpTopics":
                return <HelpTopics topics={ctx.data.topics} key={i} />;
              default:
                return (
                  <SysMsg key={i}>
                    <ReactMarkdown remarkPlugins={[gfm]}>
                      {ctx.msg}
                    </ReactMarkdown>
                  </SysMsg>
                );
            }
          })}
          <div
            style={{
              display: "block",
              overflowAnchor: "auto",
              width: "100%",
              minHeight: "3px",
            }}
          ></div>
        </Output>
      </Container>
      <InputBox socket={socket} setHeight={setHeight} />
    </Layout>
  );
};

export default Client;
