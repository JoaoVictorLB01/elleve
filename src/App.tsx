import { lazy, Suspense } from "react";
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
import BottomNav from "@/components/BottomNav";
import PageSkeleton from "@/components/PageSkeleton";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const LessonPlayer = lazy(() => import("./pages/LessonPlayer"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Library = lazy(() => import("./pages/Library"));
const ProductsServices = lazy(() => import("./pages/ProductsServices"));
const ElevveSe = lazy(() => import("./pages/ElevveSe"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-loaded heavy component
const OracleCard = lazy(() => import("@/components/OracleCard"));

const queryClient = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const hideFooter = location.pathname.includes("/aula/");

  return (
    <>
      <Navbar />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/curso/:id" element={<CourseDetail />} />
          <Route path="/curso/:courseId/aula/:lessonId" element={<LessonPlayer />} />
          <Route path="/biblioteca" element={<Library />} />
          <Route path="/produtos" element={<ProductsServices />} />
          <Route path="/elevve-se" element={<ElevveSe />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!hideFooter && <Footer />}
      <Suspense fallback={null}>
        <OracleCard />
      </Suspense>
      <BottomNav />
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
