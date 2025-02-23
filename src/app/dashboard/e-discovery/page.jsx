"use client"

import { AppSidebar } from "@/components/appSideBar";
import './eDiscovery.css';
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";

const EDiscovery = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="eDiscovery_wrapper">
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

export default EDiscovery;
