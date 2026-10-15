import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/peintyhome-logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, hasRole } = useAuth();

  const getDashboardLink = () => {
    if (hasRole("admin")) return "/admin";
    if (hasRole("employee")) return "/employee";
    return "/client";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-none">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Peintyhome" className="h-16 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</Link>
          <Link to="/packs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Packs</Link>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Comment ça marche</a>
          <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Avis</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to={getDashboardLink()}>
              <Button>Mon espace</Button>
            </Link>
          ) : (
            <>
              <Link to="/contact"><Button variant="ghost"><Phone className="h-4 w-4 mr-1" /> Contact</Button></Link>
              <Link to="/services"><Button>Nos services</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          <Link to="/services" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Services</Link>
          <Link to="/packs" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Packs</Link>
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Comment ça marche</a>
          {user ? (
            <Link to={getDashboardLink()} onClick={() => setOpen(false)}>
              <Button className="w-full">Mon espace</Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link to="/contact" className="flex-1" onClick={() => setOpen(false)}><Button variant="ghost" className="w-full">Contact</Button></Link>
              <Link to="/services" className="flex-1" onClick={() => setOpen(false)}><Button className="w-full">Nos services</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
