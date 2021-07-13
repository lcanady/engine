import styled from "@emotion/styled";
import bg from "../assets/background.png";
import city from "../assets/city.png";
import lines from "../assets/home-lines.png";
import buttonBg from "../assets/buttonbg.png";
import SysMenu from "../components/SysMenu";
import { MenuItem, Menu } from "../components/Menu";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: url(${bg});
  width: 100%;
  background-attachment: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 1440px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  position: absolute;
  top: 160px;
  margin-left: 270px;
  p {
    letter-spacing: 10px;
    text-transform: uppercase;
    font-size: 40px;
  }
`;

const Lines = styled.div`
  top: 200px;
  position: absolute;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${lines});
  width: 100%;
  height: 200px;
`;

const Swatch = styled.div`
  width: 400px;
  height: 100vh;
  margin-right: 100px;
  margin-left: auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${city});
`;

const Intro = styled.div`
  position: relative;
  top: 340px;
  left: 500px;
  width: 400px;

  p {
    margin: 16px 0;
    line-height: 1.5rem;
  }
`;

const Button = styled.div`
  background-image: url(${buttonBg});
  width: 400px;
  height: 48px;
  color: white;
  font-family: "Roboto Mono";
  font-size: 0.85rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  return (
    <Wrapper>
      <Container>
        <Title>
          <p>Terminal</p>
          <p>Velocity</p>
        </Title>
        <Lines />
        <SysMenu>
          <Menu>
            <MenuItem active>
              <a href="/">/..</a>
            </MenuItem>
            <MenuItem>
              <a href="#">/archive</a>
              <Menu>
                <MenuItem>
                  <a href="#">/article1</a>
                </MenuItem>
                <MenuItem>
                  <a href="#">/article2</a>
                </MenuItem>
                <MenuItem active>
                  <a href="#">/admin</a>
                  <Menu>
                    <MenuItem>
                      <a href="#">create.sh</a>
                    </MenuItem>
                  </Menu>
                </MenuItem>
              </Menu>
            </MenuItem>
            <MenuItem>
              <a href="/client">/game</a>
            </MenuItem>
          </Menu>
        </SysMenu>
        <Intro>
          <h1>Something About Retro Future</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In enim et
            odio donec nisl amet, adipiscing. Bibendum viverra ornare velit leo
            vel. Velit eget urna feugiat pellentesque ultricies dui, scelerisque
            facilisi aliquet. Sagittis odio enim est aliquam ac nulla tortor,
            tellus. Purus quis amet, integer consectetur maecenas amet ut odio
            ut. Varius consequat et vitae eu penatibus malesuada. Turpis
            fringilla dictumst viverra vulputate parturient.
          </p>
          <p>
            Nunc tempor ornare et sed quis id pulvinar. A faucibus cras sit nec
            vulputate congue. Facilisis sapien integer duis sapien, tristique
            facilisis duis.
          </p>
          <Button>&gt; jack_in</Button>
        </Intro>
        <Swatch />
      </Container>
    </Wrapper>
  );
};

export default Home;
