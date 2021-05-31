import styled from "@emotion/styled";
import { useContext, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { io } from "socket.io-client";
import gfm from "remark-gfm";
import { Context, MyContext, MyContextInterface } from "../store/store";

const Container = styled.div`
  height: 100vh;
  background-color: black;
  font-family: "Roboto Mono", monospace;
  font-weight: lighter;
  color: white;
  padding: 14px;
  overflow: hidden;
`;

const Client = () => {
  const { msgs, addMsg, setToken } =
    useContext<Partial<MyContextInterface>>(MyContext);

  const connect = () => {
    const socket = io("http://localhost:4201", { transports: ["websocket"] });
    socket.on("connect", () =>
      socket.send({ msg: "connect Foobar animefan", data: {} })
    );
    socket.on("message", (data: Context) => {
      addMsg!((v) => [...v, data]);
      if (data.data.token) setToken!(data.data.token);
    });
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <Container>
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
    </Container>
  );
};

export default Client;
