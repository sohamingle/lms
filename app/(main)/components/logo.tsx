import Image from "next/image";
import logo from "@/public/logo.svg"

const Logo = () => {
    return (
        <Image
        width={130}
        height={130}
        alt="logo"
        src={logo}
        />
    );
}

export default Logo;