import { Outlet } from "react-router-dom";

import { ChatbotProvider } from "../context/ChatbotContext";
import BankFooter from "./BankFooter";
import BankHeader from "./BankHeader";
import Chatbot from "./Chatbot";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
  return (
    <ChatbotProvider>
      <main className="page page--dashboard">
        <BankHeader showLogout />
        <div className="dashboard-layout">
          <DashboardSidebar />
          <div className="dashboard-layout__main">
            <Outlet />
          </div>
        </div>
        <BankFooter />
        <Chatbot />
      </main>
    </ChatbotProvider>
  );
}
