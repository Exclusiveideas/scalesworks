"use client";

import { fetchUser } from "@/apiCalls/authAPI";
import { AppSidebar } from "@/components/appSideBar";
import ChatBubble from "@/components/chatBubble";
import { columns } from "@/components/knowledgeBaseTableComp/columns";
import { KnowledgeBaseTable } from "@/components/knowledgeBaseTableComp/knowledgeBaseTable";
import UploadKnowledgeDialog from "@/components/knowledgeBaseTableComp/UploadKnowledgeDialog";
import { useSidebar } from "@/components/ui/sidebar";
import useKnowledgeBase from "@/hooks/useKnowledgeBase";
import useAuthStore from "@/store/authStore";
import useDialogStore from "@/store/useDialogStore";
import "@/styles/knowledge-base.css";
import { Info, PanelRightOpen } from "lucide-react";
import { useEffect } from "react";

const KnowledgeBase = () => {
  const { toggleSidebar } = useSidebar();

  const { tableData } = useKnowledgeBase();

  const { openDialog } = useDialogStore();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  return (
    <div className="knowledgeBase_wrapper">
      <AppSidebar />
      <div className="kb_page_content">
        <div className="kb-pageTop">
          <div onClick={toggleSidebar} className="kb_sideBar_trigger">
            <PanelRightOpen />
          </div>
        </div>
        <div className="kb_pageBody">
          <div className="pageTitleBox">
            <div className="modelTitle_container_knowledgeBase">
              Knowledge Base
            </div>
            <div className="pageTitle_subInfo">
              <Info size={16} />
              <p className="pageTitle_subInfo_text">Max file size: 50MB</p>
            </div>
          </div>

          <div className="tableHeader">
            <h3>Your Uploaded Files</h3>
            <div onClick={openDialog} className="addNewKnowledge">
              Add Knowledge
            </div>
          </div>
          <KnowledgeBaseTable columns={columns} data={tableData} />
        </div>
      </div>
      <UploadKnowledgeDialog />
      <ChatBubble />
    </div>
  );
};

export default KnowledgeBase;
