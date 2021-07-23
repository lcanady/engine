import styled from "@emotion/styled";
import city from "../assets/city.png";
import notch from "../assets/shape1.png";
import lines from "../assets/client-lines.png";
import titleBG from "../assets/titleBG.png";
import menuBG from "../assets/menuBG.png";
import { Menu, MenuItem } from "./Menu";
import { User } from "./User";

const Wrapper = styled.div`
  background-image: url(${city});
  background-size: cover;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: fixed;
`;

const Background = styled.div`
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 150px;

  background: #0e0c22;
  opacity: 0.95;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  background-image: url(${titleBG});
  width: 489px;
  height: 87px;
  top: 0;
  left: 0;
  position: absolute;
  background-position: left;

  p {
    color: white;
    margin-top: 20px;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 5px;
  }
`;

const TopMenu = styled.div`
  background-image: url(${menuBG});
  height: 70px;
  width: 366px;
  position: absolute;
  right: 0;
  background-repeat: no-repeat;
`;

const Notch = styled.div`
  background-image: url(${notch});
  background-repeat: no-repeat;
  width: 635px;
  height: 42px;
  position: absolute;
  top: 110px;
  margin-left: -50px;
  z-index: -1;
`;

const Lines = styled.div`
  position: absolute;
  width: 100%;
  top: 80px;
  height: 150px;
  z-index: 100;
  background-position: center;
  background-image: url(${lines});
  background-repeat: no-repeat;
`;

const Right = styled.div`
  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
`;
const Left = styled.div`
  @media only screen and (max-width: 1300px) {
    display: none;
  }
  position: absolute;
  top: 230px;
  left: 75px;
`;

interface LayoutProps {
  index?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, index }) => {
  return (
    <Wrapper>
      <TopMenu>
        <User />
      </TopMenu>
      <Title>
        <p>terminal velocity</p>
      </Title>
      <Lines />
      <Notch />

      <Left>
        <Menu>
          <MenuItem active={index === 0 || !index}>
            <a href="/">/..</a>
          </MenuItem>
          <MenuItem active={index === 1}>
            <a href="/game">/game.sh</a>
          </MenuItem>
        </Menu>
      </Left>
      <Right>{children}</Right>

      <Background />
    </Wrapper>
  );
};
