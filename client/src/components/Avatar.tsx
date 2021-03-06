import styled from "@emotion/styled";
import avatar from "../assets/avatar.jpeg";

interface CircleProps {
  image: string;
  height?: string;
  width?: string;
}

const Circle = styled.div<CircleProps>`
  background-color: gray;
  border-radius: 50px;
  width: ${({ width }) => (width ? width : "40px")};
  background-image: url(${({ image }) => (image ? image : avatar)});
  background-size: cover;
  background-position: center;
  height: ${({ height }) => (height ? height : "40px")};
  flex-shrink: 0;
  margin-right: 16px;
`;

interface Props {
  img: string;
  height?: string;
  width?: string;
}

const Avatar: React.FC<Props> = ({ img, height, width, ...rest }) => {
  return <Circle image={img} width={width} height={height} {...rest} />;
};

export default Avatar;
