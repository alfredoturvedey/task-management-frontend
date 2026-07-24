import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { useUIStore } from "../../store/uiStore";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-slate-50 border-b border-input  backdrop-blur">
      <div className="flex items-center justify-between h-22 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img
            src="/logo.jpeg"
            alt="IberoMax"
            className="h-22 w-auto sm:h-12 md:h-22"
          />

          <Button
            className="text-blue-950"
            variant="link"
            onClick={() => navigate("/login")}
          >
            Inicio
          </Button>

          <Button
            className="text-blue-950"
            variant="link"
            onClick={() => navigate("/login")}
          >
            Comprar
          </Button>

          <Button
            className="text-blue-950"
            variant="link"
            onClick={() => navigate("/login")}
          >
            Sobre nostros
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Button
                className="text-blue-950"
                variant="link"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </Button>
              <Button
                className="text-blue-950"
                variant="link"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
