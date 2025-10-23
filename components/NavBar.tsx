import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const services = [
  { href: '/business-operations', label: 'Business Operations' },
  { href: '/contact-center', label: 'Contact Center' },
  { href: '/it-support', label: 'IT Support' },
  { href: '/professionals', label: 'Professionals' }
];

const actionLinks = [
  { href: '/chattia', label: 'Chattia' },
  { href: '/contact-us', label: 'Contact Us' },
  { href: '/join-us', label: 'Join Us' }
];

const NavBar = () => {
  const { pathname } = useRouter();

  const navLinks = useMemo(
    () => [...services, ...actionLinks],
    []
  );

  return (
    <nav aria-label="Primary">
      <div className="nav-inner">
        <Link href="/" className="nav-link" aria-label="OPS Online Support home">
          <strong>OPS CySec Core</strong>
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? ' nav-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
