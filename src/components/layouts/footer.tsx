import { routes } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import { SiInstagram, SiMeta, SiX } from "@icons-pack/react-simple-icons";
import { navLinks } from "@/config/constants";
import { NewsletterForm } from "../shared/newsletter-form";
const socialLinks = [
  {
    id: 1,
    href: "https://twitter.com",
    icon: (
      <SiX className="hover:text-primary h-5 w-5 text-gray-600 transition-colors" />
    ),
  },
  {
    id: 2,
    href: "https://facebook.com",
    icon: (
      <SiMeta className="hover:text-primary h-5 w-5 text-gray-600 transition-colors" />
    ),
  },
  {
    id: 3,
    href: "https://instagram.com",
    icon: (
      <SiInstagram className="hover:text-primary h-5 w-5 text-gray-600 transition-colors" />
    ),
  },
  {
    id: 4,
    href: "https://linkedin.com",
    icon: (
      <SiX className="hover:text-primary h-5 w-5 text-gray-600 transition-colors" />
    ),
  },
];

export const PublicFooter = () => {
  return (
    <footer className="bg-gray-100 px-8 py-8 lg:px-0">
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Link className="flex items-center" href={routes.home}>
              <Image
                src="/logo.svg"
                alt="logo"
                width={300}
                height={100}
                className="relative h-8"
              />
            </Link>
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Link key={link.id} href={link.href}>
                {link.icon}
              </Link>
            ))}
          </div>
          <div className="space-y-2">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-8 text-center text-gray-700">
          <h4 className="text-primary text-lg font-bold"></h4>
          <p>Company No. 123456780 | VAT No. GB123456789</p>

          <p>IzzyLux is not authorized and regulated by the FCA.</p>
        </div>
        <NewsletterForm />
      </div>
    </footer>
  );
};
