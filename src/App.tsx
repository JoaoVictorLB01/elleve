import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BooksProvider } from "@/contexts/BooksContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import OracleCard from "@/components/OracleCard";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminPanel from "./pages/AdminPanel";
import Library from "./pages/Library";
import ProductsServices from "./pages/ProductsServices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const hideFooter = location.pathname.includes("/aula/");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/curso/:id" element={<CourseDetail />} />
        <Route path="/curso/:courseId/aula/:lessonId" element={<LessonPlayer />} />
        <Route path="/biblioteca" element={<Library />} />
        <Route path="/produtos" element={<ProductsServices />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <Footer />}
      <OracleCard />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <BooksProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </BooksProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
