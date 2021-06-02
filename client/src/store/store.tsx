import { createContext, useState } from "react";

export interface Context {
  data: { [key: string]: any };
  msg: string;
}

export interface MyContextInterface {
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

  const initialState: MyContextInterface = {
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
