import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { io, Socket } from "socket.io-client";
import gfm from "remark-gfm";
import { Context, MyContext, MyContextInterface } from "../store/store";
import InputBox from "../components/Input";
import Look from "../components/Look";

const Wrapper = styled.div`
  height: 100vh;
  background-color: black;
  font-family: "Roboto Mono", monospace;
  font-weight: lighter;
  color: white;
  justify-content: center;
  padding: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 60%;
  max-width: 1024px;

  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
`;

interface OutputProps {
  height: number;
}
const Output = styled.div<OutputProps>`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  flex-shrink: 1;
  height: calc(100vh - ${({ height }) => height}px - 100px);
  margin-top: 56px;
  overflow-y: overlay;
  * {
    overflow-anchor: none;
  }

  p {
    margin-top: 4px;
    margin-left: 8px;
    margin-bottom: 4px;
    a {
      color: white;
      font-weight: bold;
    }
  }

  blockquote {
    padding: 4px 0;
    padding-left: 4px;

    border-left: 1px solid rgba(255, 255, 255, 0.7);
  }

  code {
  }
`;

const Client = () => {
  const { msgs, addMsg, setToken } =
    useContext<Partial<MyContextInterface>>(MyContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [height, setHeight] = useState(72);

  useEffect(() => {
    const connect = () => {
      const socket = io("http://localhost:4201", { transports: ["websocket"] });
      socket.on("connect", () =>
        socket.send({ msg: "connect Foobar animefan", data: {} })
      );
      socket.on("message", (data: Context) => {
        addMsg!((v) => [data, ...v]);
        if (data.data.token) setToken!(data.data.token);
      });

      setSocket(socket);
    };
    connect();
  }, [addMsg, setToken]);

  return (
    <Wrapper>
      <Container>
        <Output height={height}>
          {msgs?.map((ctx, i) => {
            switch (ctx.data.type) {
              case "look":
                return <Look ctx={ctx} />;
              default:
                return (
                  <ReactMarkdown remarkPlugins={[gfm]} key={i}>
                    {ctx.msg}
                  </ReactMarkdown>
                );
            }
          })}
          <div
            style={{ overflowAnchor: "auto", width: "100%", minHeight: "3px" }}
          ></div>
        </Output>
        <InputBox socket={socket} setHeight={setHeight} />
      </Container>
    </Wrapper>
  );
};

export default Client;
