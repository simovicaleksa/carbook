import Link from "next/link";

import "@icons-pack/react-simple-icons";
import { SiGithub } from "@icons-pack/react-simple-icons";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

import Logo from "../logo/logo";

import Copyright from "./copyright";

const footerLinks = [
  {
    title: "Features",
    href: "/features",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Help",
    href: "/help",
  },
  {
    title: "Privacy",
    href: "/privacy",
  },
  {
    title: "Donate",
    href: "/donate",
  },
];

const socialLinks = [
  {
    aria: "GitHub",
    href: "https://github.com/simovicaleksa/carbook",
    icon: SiGithub,
  },
  // {
  //   aria: "YouTube",
  //   href: "https://youtube.com/@carbook",
  //   icon: SiYoutube,
  // },
];

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-secondary">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-start justify-between gap-x-8 gap-y-10 px-6 py-12 sm:flex-row xl:px-0">
          <div>
            {/* Logo */}
            <Logo />

            <ul className="mt-6 flex flex-wrap items-center gap-4">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Newsletter */}
          <div className="w-full max-w-xs">
            <h6 className="font-semibold">Stay up to date</h6>
            <p className="text-sm text-muted-foreground">
              Receive updates on new features, no spam!
            </p>
            <form className="mt-6 flex items-center gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button>Subscribe</Button>
            </form>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
          {/* Copyright */}
          <Copyright />

          <div className="flex items-center gap-5 text-muted-foreground">
            {socialLinks.map((link) => {
              if (!link.icon) return null;
              const Icon = link.icon;

              return (
                <Link
                  aria-label={link.aria}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={link.href}
                >
                  <Icon className="size-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
