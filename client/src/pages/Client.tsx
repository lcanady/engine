import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { io, Socket } from "socket.io-client";
import gfm from "remark-gfm";
import { Context, MyContext } from "../store/store";
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
}
const Output = styled.div<OutputProps>`
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: column-reverse;
  flex-shrink: 1;
  margin-top: 280px;
  bottom: 130px;
  width: 960px;
  height: calc(75% - ${({ ht }) => ht}px);

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
  const { msgs, addMsg, setToken, token, setContents, contents, setUser } =
    useContext(MyContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [height, setHeight] = useState(68);

  useEffect(() => {
    const connect = () => {
      const socket = io("http://10.0.0.244:4201", {
        transports: ["websocket"],
      });
      socket.on("connect", () => {
        const localToken = sessionStorage.getItem("token") || "";
        if (localToken) {
          setToken!(localToken);
          socket.send({ msg: "", data: { token: localToken } });
        }
      });

      socket.on("message", (data: Context) => {
        addMsg!((v) => [data, ...v]);
        if (data.data.token) {
          sessionStorage.setItem("token", data.data.token);
          setToken!(data.data.token);
        }

        if (data.data.type === "self") {
          setUser!({ ...data.data.user });
        }
      });

      socket.io.on("close", () => console.log("Socket Closed!"));

      setSocket(socket);
    };

    if (!socket) connect();
  }, [addMsg, setToken, socket, token, contents, setContents, setUser]);

  return (
    <Layout index={0}>
      <Container>
        <Output ht={height}>
          {msgs?.map((ctx, i) => {
            switch (ctx.data.type) {
              case "look":
                return <Look ctx={ctx} key={i} />;
              case "say":
                return <PoseBox ctx={ctx} key={i} />;
              case "pose":
                return <PoseBox ctx={ctx} key={i} />;
              case "helpTopics":
                return <HelpTopics topics={ctx.data.topics} />;
              default:
                return (
                  <SysMsg>
                    <ReactMarkdown remarkPlugins={[gfm]} key={i}>
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
