import styled from "@emotion/styled";
import { useState } from "react";
import { Socket } from "socket.io-client";
import TextAreaAutoResize from "react-textarea-autosize";
import { useContext } from "react";
import { MyContext } from "../store/store";
import { useRef } from "react";

const Input = styled(TextAreaAutoResize)`
  min-height: 68px;
  max-height: 300px;
  overflow-y: auto;
  flex-grow: 1;
  flex-shrink: 0;
  width: 700px;
  position: fixed;
  bottom: 16;
  margin-top: 16px;
  background: rgba(47, 54, 108, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 5px;
  color: white;
  padding: 24px;
  font-size: 0.85rem;
  font-family: "Roboto Mono";
  bottom: 16px;

  resize: none;

  outline: none;

  @media only screen and (max-width: 1024px) {
    width: calc(100vw - 32px);
  }
`;

interface Props {
  socket: Socket | null;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

const InputBox: React.FC<Props> = ({ socket, setHeight }) => {
  const [input, setInput] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const { token } = useContext(MyContext);

  return (
    <Input
      ref={ref}
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
      onHeightChange={() => setHeight(ref.current!.offsetHeight)}
      onChange={(ev) => {
        setHeight(ev.currentTarget.offsetHeight);
        setInput(ev.currentTarget.value);
      }}
      value={input}
    />
  );
};

export default InputBox;
