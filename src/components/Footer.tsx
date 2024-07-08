import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between p-4 w-full">
      <p className="text-slate-600 text-sm font-medium w-max">
        &copy; {new Date().getFullYear()}, made with ❤️ for a better web.
      </p>
      <ul className="flex gap-4 items-center text-slate-600 font-medium text-sm">
        <Link href="#">About</Link>
        <Link href="#">Support</Link>
        <Link href="#">License</Link>
      </ul>
    </footer>
  );
};

export default Footer;
