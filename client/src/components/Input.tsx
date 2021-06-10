import styled from "@emotion/styled";
import { useState } from "react";
import { Socket } from "socket.io-client";

const Input = styled.div`
  min-height: 72px;
  max-height: 500px;
  overflow-y: auto;
  width: 80%;
  margin-top: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  outline: none;
  padding: 24px;
  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
`;

interface Props {
  socket: Socket | null;
}

const InputBox: React.FC<Props> = ({ socket }) => {
  const [history, setHistory] = useState<any[]>([]);

  return (
    <Input
      contentEditable
      onKeyDown={(ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          const msg = { msg: ev.currentTarget.innerText, data: {} };
          socket?.send(msg);
          setHistory((v) => [...v, msg]);
          ev.currentTarget.innerText = "";
        }
      }}
    />
  );
};

export default InputBox;
