import { FaFacebook, FaInstagramSquare } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer p-4 text-accent-content mt-4 xl:mt-8">
      <ul className="flex flex-row space-x-4">
        <li>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.facebook.com/profile.php?id=61576451557522"
          >
            <FaFacebook className="size-6" />
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.instagram.com/stickerch.art/"
          >
            <FaInstagramSquare className="size-6" />
          </a>
        </li>
      </ul>
      <p>© {new Date().getFullYear()} GRSG LLC</p>
    </footer>
  );
}
