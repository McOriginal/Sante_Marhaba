import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

//i18n
import { withTranslation } from 'react-i18next';
// Redux
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import withRouter from '../withRouter';

import { AuthContext } from '../../../Auth/AuthContext';
import { connectedUserName } from '../../../Pages/Authentication/userInfos';

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState('Admin');

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('authUser')) {
      if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
        const obj = JSON.parse(localStorage.getItem('authUser'));
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === 'fake' ||
        process.env.REACT_APP_DEFAULTAUTH === 'jwt'
      ) {
        const obj = JSON.parse(localStorage.getItem('authUser'));
        setusername(obj.username);
      }
    }
  }, [props.success]);

  const { logout } = useContext(AuthContext);
  // const handleLogout = logout();

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className='d-inline-block'
      >
        <DropdownToggle
          className='btn header-item justify-content-center d-flex align-items-center'
          id='page-header-user-dropdown'
          tag='button'
        >
          <span className='fw-bold font-size-11 text-warning d-inline-block ms-2 me-2'>
            {connectedUserName}
          </span>
          <i className='mdi mdi-chevron-down d-xl-inline-block' />
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end'>
          <DropdownItem tag='a' href='/userprofile'>
            {' '}
            <i className='ri-user-line align-middle me-2' />
            {props.t('Profile')}{' '}
          </DropdownItem>

          <div className='dropdown-divider' />
          <DropdownItem
            onClick={() => logout()}
            className='dropdown-item bg-danger text-white cursor-pointer'
          >
            <i className='ri-shut-down-line align-middle me-2 text-white' />
            Déconnecter
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { error, success } = state.profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
