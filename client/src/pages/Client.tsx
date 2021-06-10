import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { io, Socket } from "socket.io-client";
import gfm from "remark-gfm";
import { Context, MyContext, MyContextInterface } from "../store/store";
import InputBox from "../components/Input";

const Wrapper = styled.div`
  height: 100vh;
  background-color: black;
  font-family: "Roboto Mono", monospace;
  font-weight: lighter;
  color: white;
  padding: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  margin-top: auto;
  width: 80%;
  max-width: 1024px;

  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
`;

const Output = styled.div`
  width: 100%;
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
    border-left: 1px solid rgba(255, 255, 255, 0.7);
  }

  code {
  }
`;

const Client = () => {
  const { msgs, addMsg, setToken } =
    useContext<Partial<MyContextInterface>>(MyContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connect = () => {
      const socket = io("http://localhost:4201", { transports: ["websocket"] });
      socket.on("connect", () =>
        socket.send({ msg: "connect Foobar animefan", data: {} })
      );
      socket.on("message", (data: Context) => {
        addMsg!((v) => [...v, data]);
        if (data.data.token) setToken!(data.data.token);
      });

      setSocket(socket);
    };
    connect();
  }, [addMsg, setToken]);

  return (
    <Wrapper>
      <Container>
        <Output>
          {msgs?.map((ctx, i) => {
            switch (ctx.data.type) {
              default:
                return (
                  <ReactMarkdown remarkPlugins={[gfm]} key={i}>
                    {ctx.msg}
                  </ReactMarkdown>
                );
            }
          })}
        </Output>
      </Container>
      <InputBox socket={socket} />
    </Wrapper>
  );
};

export default Client;
