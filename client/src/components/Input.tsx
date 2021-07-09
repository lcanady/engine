import styled from "@emotion/styled";
import { useState } from "react";
import { Socket } from "socket.io-client";
import TextAreaAutoResize from "react-textarea-autosize";
import { useContext } from "react";
import { MyContext } from "../store/store";

const Input = styled(TextAreaAutoResize)`
  min-height: 32px;
  max-height: 300px;
  overflow-y: auto;
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 16px;
  margin-top: 16px;
  background: rgba(47, 54, 108, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px);
  border-radius: 5px;
  color: white;
  padding: 24px;
  font-size: 0.85rem;
  font-family: "Roboto Mono";
  bottom: 16px;

  resize: none;

  outline: none;
`;

interface Props {
  socket: Socket | null;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

const InputBox: React.FC<Props> = ({ socket, setHeight }) => {
  const [input, setInput] = useState("");
  const { token } = useContext(MyContext);

  return (
    <Input
      onKeyDown={(ev) => {
        setHeight(ev.currentTarget.offsetHeight);
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          const msg = { msg: input, data: { token } };
          socket?.send(msg);

          ev.currentTarget.value = "";
          setInput("");
          setHeight(68);
        }
      }}
      onChange={(ev) => {
        setHeight(ev.currentTarget.offsetHeight);
        setInput(ev.currentTarget.value);
      }}
      value={input}
    />
  );
};

export default InputBox;
