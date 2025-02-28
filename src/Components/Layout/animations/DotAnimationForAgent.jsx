import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    background-color: lightgreen;
  }
  50% {
    transform: scale(1.1);
    background-color: pink;

  }
  100% {
    transform: scale(0.9);
    background-color: powderblue;

  }
`;

// Styled components
const DotsContainer = styled.section`
padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color:rgb(250, 250, 250); 
  border-radius:50px;
  width: 60px;
`;

const Dot = styled.div`
  background-color:gray;
  height: 10px;
  width: 10px;
  margin-right: 5px;
  border-radius: 10px;
//   background-color: #b3d4fc;
  animation: ${pulse} 1.5s infinite ease-in-out;

  &:last-child {
    margin-right: 0;
  }

  &:nth-child(1) {
    animation-delay: -0.3s;
  }

  &:nth-child(2) {
    animation-delay: -0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.1s;
  }
`;

const AgentLoader = () => {
    return (
        <DotsContainer>
            <Dot />
            <Dot />
            <Dot />

        </DotsContainer>
    );
};

export default AgentLoader;
