import { memo } from 'react';
import styled from "styled-components";
import { motion } from 'framer-motion';

const Container = styled.div`
  height: 85px;
  width: 100vw;
  position: sticky;
  top: 70px;
  background-color: ${props => props.theme.background};
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  z-index: 14;
  margin: 0 -15px;
`;

const Wrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Carousel = ({ children }) => {
  return (
    <Container>
      <Wrapper  onPan={(e, pointInfo) => {console.log(e, pointInfo)}}>
        {children}
      </Wrapper>
    </Container>
  );
};

export default memo(Carousel);