import styled from "@emotion/styled";
import { Context, MyContext } from "../store/store";
import MD from "../components/MD";
import Avatar from "../components/Avatar";
import { useContext } from "react";

const Wrapper = styled.div`
  display: flex;

  padding: 16px 0;
  margin-left: 8px;
`;
const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Name = styled.p`
  color: #77abc0;
`;

interface Props {
  ctx: Context;
  key: number;
}

const PoseBox: React.FC<Props> = ({
  ctx: {
    msg,
    data: { avatar, name, id },
  },
}) => {
  const { user } = useContext(MyContext);
  return (
    <Wrapper>
      <Avatar img={avatar} />
      <TextBlock>
        <Name>
          {name}
          {user?.flags?.includes("wizard") ||
            (user?.flags?.includes("immortal") && `(${id})`)}
        </Name>
        <MD text={msg} />
      </TextBlock>
    </Wrapper>
  );
};

export default PoseBox;
