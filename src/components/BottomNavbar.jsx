import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home as HomeIcon, Chat as ChatIcon, Person as PersonIcon } from '@mui/icons-material';

const BottomNavbar = () => {
  const StyledBottomNavigation = styled(BottomNavigation)`
  && {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #3f51b5;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
  }
  `;

  const StyledLink = styled(Link)`
    && {
      color: white;
      text-decoration: none;
      margin-left: 100px;
      margin-right: 100px;
    }
  `;

  // Get the current route to set the active item in the navigation
  const location = useLocation();

  return (
    <StyledBottomNavigation showLabels value={location.pathname}>
      <StyledLink to="/">
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          value="/"
          showLabel // Show the label (text) below the icon
          style={{ color: 'white' }} // Set the text color to white
        />
      </StyledLink>

      {/* <StyledLink to="/chat">
        <BottomNavigationAction
          label="Chat"
          icon={<ChatIcon />}
          value="/chat"
          showLabel // Show the label (text) below the icon
          style={{ color: 'white' }} // Set the text color to white
        />
      </StyledLink> */}

      <StyledLink to="/profile">
        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          value="/profile"
          showLabel // Show the label (text) below the icon
          style={{ color: 'white' }} // Set the text color to white
        />
      </StyledLink>
    </StyledBottomNavigation>
  );
};

export default BottomNavbar;
