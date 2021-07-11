import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { io, Socket } from "socket.io-client";
import gfm from "remark-gfm";
import { Context, MyContext, MyContextInterface } from "../store/store";
import InputBox from "../components/Input";
import Look from "../components/Look";
import backgrounds from "../assets/background.png";
import PoseBox from "../components/PoseBox";

const Wrapper = styled.div`
  height: 100vh;
  background-image: url(${backgrounds});
  background-repeat: no-repeat;
  background-size: cover;
  font-family: "Roboto Mono", monospace;

  color: white;
  justify-content: center;
  padding: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 771px;
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
  display: flex;
  flex-direction: column-reverse;
  flex-shrink: 1;
  height: calc(100vh - ${({ ht }) => ht}px - 40px);

  overflow-y: overlay;
  * {
    overflow-anchor: none;
  }

  h2 {
    font-size: 0.9rem;
    margin-bottom: 8px;
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
  const { msgs, addMsg, setToken, token, setFlags } =
    useContext<Partial<MyContextInterface>>(MyContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [height, setHeight] = useState(100);

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
          console.log("connected!", localToken);
        }
      });
      socket.on("message", (data: Context) => {
        addMsg!((v) => [data, ...v]);
        if (data.data.token) {
          console.log(data.data.token);
          sessionStorage.setItem("token", data.data.token);
          setToken!(data.data.token);
        }
      });

      setSocket(socket);
    };
    if (!socket) connect();
  }, [addMsg, setToken, socket, token]);

  return (
    <Wrapper>
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
              case "self":
                setFlags!(ctx.data.flags);
                return false;
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
