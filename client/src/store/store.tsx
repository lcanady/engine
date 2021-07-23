import React, { createContext, useState } from "react";
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
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  flags: string;
  setFlags: React.Dispatch<React.SetStateAction<string>>;
  contents: InvItem[];
  setContents: React.Dispatch<React.SetStateAction<InvItem[]>>;
  msgs: Context[];
  addMsg: React.Dispatch<React.SetStateAction<Context[]>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export const MyContext = createContext<Partial<MyContextInterface>>({});
interface Props {}

const Provider: React.FC<Props> = ({ children }) => {
  const [msgs, addMsg] = useState<Context[]>([]);
  const [token, setToken] = useState<string>("");
  const [flags, setFlags] = useState<string>("");
  const [contents, setContents] = useState<InvItem[]>([]);
  const [user, setUser] = useState<User>({
    id: "",
    flags: "",
    avatar: "",
    name: "",
  });

  const initialState: MyContextInterface = {
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
