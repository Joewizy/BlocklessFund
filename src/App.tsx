import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateCampaignPage from "./pages/Create-Campaign-Page";
import Proposals from "./pages/Proposals";
import ViewCampaigns from "./pages/ViewCampaigns";
import { Providers } from "./providers";
import MintPage from "./pages/MintPage";
import Layout from "@/components/Layout"; 

const App = () => (
  <Providers>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Layout routes (with Navbar/Footer) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="create-campaign" element={<CreateCampaignPage />} />
            <Route path="proposal" element={<Proposals />} />
            <Route path="campaigns" element={<ViewCampaigns />} />
            <Route path="mint" element={<MintPage />} />
          </Route>

          {/* Routes without layout (optional) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Providers>
);

export default App;
