"use client"

import { AppSidebar } from "@/components/appSideBar";
import './legalAssistant.css';
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";

const LegalAssistant = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="legalAssistant_wrapper">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="sideBar_trigger">
            <PanelRightOpen />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAssistant;
