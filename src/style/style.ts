import styled, { css } from "styled-components";
export interface DarkBackgroundProps {
    disappear: Boolean; // 'disappear' jest opcjonalne i typu boolean
  }
  
export const DarkBackground = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'disappear'
  })<DarkBackgroundProps>`
    display: none; /* Hidden by default */
    position: fixed !important; 
    z-index: 999; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  
    ${props =>
      props.disappear &&
      css`
        display: flex;
        justify-content: center;
      `}
  `;