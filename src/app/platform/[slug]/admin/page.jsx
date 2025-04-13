"use client";

import { AppSidebar } from "@/components/appSideBar";
import "./admin.css";
import { Feather, MailCheck, PanelRightOpen } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { Separator } from "@radix-ui/react-dropdown-menu";
import ChatBubble from "@/components/chatBubble";
import { AdminAction } from "@/components/modelOverview";
import EmailListDialog from "@/components/adminDashboardComp/emailListDialog";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import CompanyLogoDialog from "@/components/adminDashboardComp/companyLogoDialog";

const Admin = () => {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const { user, updateUser } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);
  const { openEmailListDialog, openUpdateCompanyLogoDialog } =
    useAdminDashboardStore();

  useEffect(() => {
    if (isHydrated && !user) {
      // router.push("/");
    }
  }, [user, isHydrated]);

  const adminActions = [
    {
      title: "Update Email List",
      id: "email-list",
      Icon: MailCheck,
      function: () => openEmailListDialog(),
    },
    {
      title: "Update Company Logo",
      id: "company-logo",
      Icon: Feather,
      function: () => openUpdateCompanyLogoDialog(),
    },
  ];

  return (
    <div className="admin-dashboard">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="sideBar_trigger">
            <PanelRightOpen className="panelBtn" />
          </div>
        </div>
        <div className="pageBody">
          <div className="aboveTheFold">
            <h2 className="dashboardTitle">Welcome, Edvard</h2>
          </div>
          <Separator className="seperatorCss" />
          <div className="modelsOverview">
            {adminActions?.map((action, i) => (
              <AdminAction action={action} key={i} />
            ))}
          </div>
        </div>
      </div>
      <ChatBubble />
      <EmailListDialog />
      <CompanyLogoDialog />
    </div>
  );
};

export default Admin;
