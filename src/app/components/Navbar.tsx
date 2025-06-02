import { FiBell } from "react-icons/fi";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex items-center w-full h-16 bg-[rgb(21,21,21)] shadow-md px-6">
    <div className="ml-0 ">
        <Image src="/ffff.png" alt="Logo" width={60} height={40} />
      </div>
      <h2 className="font-bold text-white text-2xl "
      >FYP Portal</h2>
    
      
    </nav>
  );
}