import logo from '/Logo.png';
import { Link } from 'react-router';

const Navbar = (props) => {
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          {/* Logo Section */}
          <a href='#' className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-8" alt="RepoFund Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">RepoFund</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>

          {/* Navbar Links */}
          <div className="hidden w-full md:flex md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-row space-x-8 rtl:space-x-reverse">
              <li>
                <a href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
              </li>
              <li>
                <a href="/discover" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Discover</a>
              </li>
              <li>
                <a href="/create_project" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Start a Project</a>
              </li>

              {/* Wallet Address / Connect Wallet */}
              <li className="flex items-center">
                {props.address ? (
                  <div className="flex items-center">
                    <Link
                      to="/profile"
                      state={{ address: props.address }}
                      className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                    >
                      {props.address.slice(0, 5) + "..." + props.address.slice(props.address.length - 4)}
                    </Link>
                    <span className="ml-2 text-green-500 text-sm">Connected to Wallet</span>
                  </div>
                ) : (
                  <Link
                    to="/connect-wallet"
                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                  >
                    Connect Wallet
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
