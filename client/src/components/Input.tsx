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
  width: 960px;
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

  bottom: 56px;
  @media only screen and (max-width: 1024px) {
    width: calc(100vw - 32px);
    margin: 0 16px;
  }
`;

interface Props {
  socket: Socket | undefined;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

const InputBox: React.FC<Props> = ({ socket, setHeight }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
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

          setHistory([...history, ev.currentTarget.value]);

          setCount(count + 1);

          setInput("");
          setHeight(68);
        }

        if (ev.shiftKey && ev.key === "ArrowUp") {
          ev.preventDefault();
          setInput(history[count]);
          if (history.length >= 0) {
            if (count > 0) {
              setCount(count - 1);
            } else {
              setCount(history.length);
            }
          }
        }

        if (ev.shiftKey && ev.key === "ArrowDown") {
          ev.preventDefault();
          setInput(history[count]);
          if (history.length >= 0) {
            if (count < history.length) {
              setCount(count + 1);
            } else {
              setCount(0);
            }
          }
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
