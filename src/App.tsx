import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";
import Home from './pages/Home';
import Journal from './pages/Journal';
import Box from './pages/Box';
import Tutorials from './pages/Tutorials';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Partners from './pages/Partners';
import HairProfile from './pages/HairProfile';
import AddCare from './pages/AddCare';
import Rewards from './pages/Rewards';
import Referral from './pages/Referral';
import HairstyleIdeas from './pages/HairstyleIdeas';
import DiscountCodes from './pages/DiscountCodes';
import Favorites from './pages/Favorites';
import GrowthTracker from './pages/GrowthTracker';
import WashDayTracker from './pages/WashDayTracker';
import BoxContent from './pages/BoxContent';
import FullJournal from './pages/FullJournal';
import DetailedRoutine from './pages/DetailedRoutine';
import LanguageSelection from './pages/LanguageSelection';
import Auth from "./pages/Auth";
import Premium from "./pages/Premium";
import PremiumSuccess from "./pages/PremiumSuccess";
import RoutineSuccess from "./pages/RoutineSuccess";
import ProductRecommendations from "./pages/ProductRecommendations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/box" element={<Box />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/community" element={<Community />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/hair-profile" element={<HairProfile />} />
                <Route path="/add-care" element={<AddCare />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/hairstyle-ideas" element={<HairstyleIdeas />} />
                <Route path="/discount-codes" element={<DiscountCodes />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/growth-tracker" element={<GrowthTracker />} />
                <Route path="/wash-day-tracker" element={<WashDayTracker />} />
                <Route path="/box-content" element={<BoxContent />} />
                <Route path="/full-journal" element={<FullJournal />} />
                <Route path="/detailed-routine" element={<DetailedRoutine />} />
                <Route path="/language-selection" element={<LanguageSelection />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/premium-success" element={<PremiumSuccess />} />
                <Route path="/routine-success" element={<RoutineSuccess />} />
                <Route path="/product-recommendations" element={<ProductRecommendations />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AppProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
