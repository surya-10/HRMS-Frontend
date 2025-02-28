import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    background-color: #b3d4fc;
  }
  50% {
    transform: scale(1.1);
    background-color: #6793fb;

  }
  100% {
    transform: scale(0.9);
    background-color: #b3d4fc;

  }
`;

// Styled components
const DotsContainer = styled.section`
padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const Dot = styled.div`
  height: 10px;
  width: 10px;
  margin-right: 10px;
  border-radius: 10px;
  background-color: #b3d4fc;
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

const DotsLoader = () => {
  return (
    <DotsContainer>
      <Dot />
      <Dot />
      <Dot />
      
    </DotsContainer>
  );
};

export default DotsLoader;
