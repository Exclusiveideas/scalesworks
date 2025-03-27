"use client";

import { AppSidebar } from "@/components/appSideBar";
import { columns } from "@/components/knowledgeBaseTableComp/columns";
import { KnowledgeBaseTable } from "@/components/knowledgeBaseTableComp/knowledgeBaseTable";
import UploadKnowledgeDialog from "@/components/knowledgeBaseTableComp/UploadKnowledgeDialog";
import { useSidebar } from "@/components/ui/sidebar";
import useKnowledgeBase from "@/hooks/useKnowledgeBase";
import useDialogStore from "@/store/useDialogStore";
import "@/styles/knowledge-base.css";
import { PanelRightOpen } from "lucide-react";

const KnowledgeBase = () => {
  const { toggleSidebar } = useSidebar();

  const { tableData } = useKnowledgeBase();

  const { openDialog } = useDialogStore();

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
          <div className="modelTitle_container_knowledgeBase">
            Knowledge Base
          </div>

          <div className="tableHeader">
            <h3>Your Uploaded Files</h3>
            <div onClick={openDialog} className="addNewKnowledge">Add Knowledge</div>
          </div>
          <KnowledgeBaseTable columns={columns} data={tableData} />
        </div>
      </div>
      <UploadKnowledgeDialog />
    </div>
  );
};

export default KnowledgeBase;
