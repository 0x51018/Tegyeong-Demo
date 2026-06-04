import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CommunityScreen } from "./screens/CommunityScreen";
import { GroupBuyScreen } from "./screens/GroupBuyScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { MarketScreen } from "./screens/MarketScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { VinylDetailScreen } from "./screens/VinylDetailScreen";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/search" element={<Navigate to="/" replace />} />
        <Route path="/vinyl/:vinylId" element={<VinylDetailScreen />} />
        <Route path="/group-buy" element={<GroupBuyScreen />} />
        <Route path="/market" element={<MarketScreen />} />
        <Route path="/sell" element={<Navigate to="/market" replace />} />
        <Route path="/community" element={<CommunityScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
