import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

export default function FooterComponent() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4">
      <div className="container mx-auto px-4 flex flex-col items-center md:flex-row md:justify-between">
        {/* Trademark Section */}
        <div className="text-sm text-center md:text-left">
          DeFindstarter © 2024
        </div>

        {/* External Links Section */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://github.com/samirxnova"
            className="text-gray-400 hover:text-white transition"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
