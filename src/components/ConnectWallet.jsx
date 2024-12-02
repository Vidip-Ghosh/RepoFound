import logo from "/Logo.png"

export default function ConnectWallet(props) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex justify-center space-x-3 rtl:space-x-reverse">
        <img src={logo} className="h-12" alt="Repo Fund Logo" />
        <div className="text-4xl font-bold text-center whitespace-nowrap dark:text-white">Repo Fund</div>
      </div>
      {/* <a href='#' className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src={logo} className="h-8" alt="Flowbite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">RepoFund</span>
      </a> */}
      <div className="flex justify-center">
        <button
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
          onClick={props.connectMetamask}
        >
          Connect to Metamask
        </button>
      </div>
    </div>
  );
}
