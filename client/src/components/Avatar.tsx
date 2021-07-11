import styled from "@emotion/styled";
import avatar from "../assets/avatar.jpeg";

interface CircleProps {
  image: string;
}

const Circle = styled.div<CircleProps>`
  background-color: gray;
  border-radius: 28px;
  width: 40px;
  background-image: url(${({ image }) => (image ? image : avatar)});
  background-size: cover;
  background-position: center;
  height: 40px;
  flex-shrink: 0;
  margin-right: 16px;
`;

interface Props {
  img: string;
}

const Avatar: React.FC<Props> = ({ img, ...rest }) => {
  return <Circle image={img} {...rest} />;
};

export default Avatar;
