import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Approved from "./pages/Approved";
import Decline from "./pages/Decline";
import NoAnswer from "./pages/NoAnswer";
import NotFound from "./pages/NotFound";
import Lead1 from "./pages/Lead1";
import Lead2 from "./pages/Lead2";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/approved" element={<Approved />} />
            <Route path="/decline" element={<Decline />} />
            <Route path="/no-answer" element={<NoAnswer />} />
            <Route path="/lead1" element={<Lead1 />} />
            <Route path="/lead2" element={<Lead2 />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;