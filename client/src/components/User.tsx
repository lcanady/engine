import styled from "@emotion/styled";
import { useContext } from "react";
import { MyContext } from "../store/store";
import Avatar from "./Avatar";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Login = styled.p``;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: -12px;
`;

const Title = styled.p``;

export const User: React.FC = () => {
  const { user } = useContext(MyContext);

  return (
    <Wrapper>
      {user ? (
        <UserContainer>
          <Avatar img={user.avatar} width="32px" height="32px" />
          <Title>/{user.name}</Title>
        </UserContainer>
      ) : (
        <Login>login</Login>
      )}
    </Wrapper>
  );
};
