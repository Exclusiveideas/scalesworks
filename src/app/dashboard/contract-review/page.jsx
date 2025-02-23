"use client"

import { AppSidebar } from "@/components/appSideBar";
import './contract-review.css';
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";

const ContractReview = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="contractReview_wrapper">
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
}

export default ContractReview