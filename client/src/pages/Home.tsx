import styled from "@emotion/styled";
import bg from "../assets/bridge-1.png";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 50.9%),
    url(${bg});
  background-attachment: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Intro = styled.div`
  width: 550px;
  p {
    margin-top: 0.5rem;
    text-align: justify;
  }
`;

const Home = () => {
  return (
    <Wrapper>
      <Intro>
        <h1>This is a Game about Personal Horror</h1>
        <p>
          Yadda yadda, adult themes and topics. Adults only. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. In vitae, ut sed aliquam
          accumsan. Sapien ultrices ut id vitae orci imperdiet risus. Fusce sit
          eget massa tortor in diam ipsum. Vestibulum, consectetur cras purus
          neque mauris, a velit. Mauris quis risus, vulputate turpis
        </p>
      </Intro>
    </Wrapper>
  );
};

export default Home;
