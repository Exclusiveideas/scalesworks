"use client"

import { AppSidebar } from "@/components/appSideBar";
import "./dashboard.css";
import { PanelRightOpen } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ModelOverview from "@/components/modelOverview";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import ChatBubble from "@/components/chatBubble";

const modelsOverview = [
  {
    title: 'Legal Assistant',
    description: 'Find relevant case laws in minutes instead of hours.',
    image: 'legal_assistant.jpg',
    link: 'legal-assistant'
  },
  {
    title: 'E-Discovery',
    description: 'AI assistant that helps you go through files in seconds.',
    image: 'e-discovery.jpg',
    link: 'e-discovery'
  },
  {
    title: 'Document Automation',
    description: 'Automated document generation based on McGrath Kane templates.',
    image: 'document_automation.png',
    link: 'document-automation'
  },
  {
    title: 'Contract Review',
    description: 'Eliminate mistakes and flag risks in contracts.',
    image: 'contract_review.jpg',
    link: 'contract-review'
  },
  {
    title: 'Transcription',
    description: 'AI-powered transcription and deposition summary.',
    image: 'transcription.jpg',
    link: 'transcription'
  },
]

const Dashboard = () => {
  const { toggleSidebar } = useSidebar()
  const router = useRouter();
    
  const { user } = useAuthStore();
  
  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth"); // Redirect only after hydration
    }
  }, [user, isHydrated]);
  

  return (
    <div className="dashboard_wrapper">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="sideBar_trigger">
            <PanelRightOpen />
          </div>
        </div>
        <div className="pageBody">
          <h2 className="dashboardTitle">Your Dashboard</h2>
          <Separator className="my-4 bg-white"/>
          <div className="modelsOverview">
            {modelsOverview?.map((model, i) => (
              <ModelOverview model={model} key={i} />
            ))}
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
};

export default Dashboard;
