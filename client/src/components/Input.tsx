import styled from "@emotion/styled";
import { useState } from "react";
import { Socket } from "socket.io-client";
import TextAreaAutoResize from "react-textarea-autosize";

const Input = styled(TextAreaAutoResize)`
  min-height: 72px;
  max-height: 300px;
  overflow-y: auto;
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 16px;
  margin-top: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  outline: none;
  color: white;
  padding: 24px;
  font-size: 16px;
  font-family: "Roboto Mono";
  font-weight: lighter;
  bottom: 0;
  border: none;
  resize: none;
  border-radius: 2px;
  outline: none;
`;

interface Props {
  socket: Socket | null;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

const InputBox: React.FC<Props> = ({ socket, setHeight }) => {
  const [input, setInput] = useState("");

  return (
    <Input
      onKeyDown={(ev) => {
        setHeight(ev.currentTarget.offsetHeight);
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          const msg = { msg: ev.currentTarget.value, data: {} };
          socket?.send(msg);

          ev.currentTarget.value = "";
          setInput("");
          setHeight(72);
        }
      }}
      onChange={(ev) => setInput(ev.currentTarget.value)}
      value={input}
    />
  );
};

export default InputBox;
