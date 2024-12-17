import { Link } from 'react-router-dom';
// import logo from "../../Assets/react.svg";
import { useAuth } from '../../Context/useAuth';
import './NavBar.scss';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  return (
    <nav className='cmp-navbar'>
      <div className='common-wrapper'>
        <div>
          {isLoggedIn() ? (
            <div>
              <div>
                Welcome, {user?.displayName}
              </div>
              <a
                onClick={logout}
                // className='px-8 py-3 font-bold rounded bg-lightGreen hover:opacity-70'
              >
                Logout
              </a>
            </div>
          ) : (
            <div>
              <Link to='/'>
                Login
              </Link>
              {/* <Link
                to="/register"
                className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
              >
                Signup
              </Link> */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
