import React from 'react';
import styled from 'styled-components';

const DotLoader = () => {
    return (
        <div className='flex justify-center items-center flex-col gap-5'>
            
            <StyledWrapper>
                <div className="loader" />

            </StyledWrapper>
            <p className='text-fuchsia-800'>Wait a moment...</p>
        </div>
    );
}

const StyledWrapper = styled.div`
  .loader {
    --s: 15px;
    width: calc(var(--s) * 2.33);
    aspect-ratio: 1;
    display: flex;
    justify-content: space-between;
  }
  .loader::before,
  .loader::after {
    content: "";
    width: var(--s);
    --_g: no-repeat radial-gradient(farthest-side, #ff33aa 94%, #0000);
    background: var(--_g) top, var(--_g) bottom;
    background-size: 100% var(--s);
    transform-origin: 50% calc(100% - var(--s) / 2);
    animation: l30 1s infinite;
  }
  .loader::after {
    transform-origin: 50% calc(var(--s) / 2);
  }
  @keyframes l30 {
    70%,
    100% {
      transform: rotate(-270deg);
    }
  }`;

export default DotLoader;
