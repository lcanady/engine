import React, { createContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import { InvItem } from "../components/Look";

interface User {
  id: string;
  avatar: string;
  flags: string;
  name: string;
}

export interface Context {
  data: { [key: string]: any };
  msg: string;
}

export interface MyContextInterface {
  user: User | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
  socket: Socket | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  flags: string;
  setFlags: React.Dispatch<React.SetStateAction<string>>;
  contents: InvItem[];
  setContents: React.Dispatch<React.SetStateAction<InvItem[]>>;
  msgs: Context[];
  addMsg: React.Dispatch<React.SetStateAction<Context[]>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  connect: () => void;
}

export const MyContext = createContext<Partial<MyContextInterface>>({});
interface Props {}

const Provider: React.FC<Props> = ({ children }) => {
  const [msgs, addMsg] = useState<Context[]>([]);
  const [token, setToken] = useState<string>("");
  const [flags, setFlags] = useState<string>("");
  const [contents, setContents] = useState<InvItem[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>();
  const [user, setUser] = useState<User | undefined>();

  const connect = () => {
    const socket = io("http://localhost:4201", {
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

    socket.io.on("close", (err) => console.log(err));

    setSocket!(socket);
  };

  const initialState: MyContextInterface = {
    connect,
    socket,
    setSocket,
    user,
    setUser,
    contents,
    setContents,
    flags,
    setFlags,
    msgs,
    addMsg,
    token,
    setToken,
  };

  return (
    <MyContext.Provider value={initialState}>{children}</MyContext.Provider>
  );
};

export default Provider;
