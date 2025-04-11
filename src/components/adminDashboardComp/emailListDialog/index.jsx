"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import "./el.css";
import useEmailListDialog from "@/hooks/useEmailListDialog";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import { columns } from "./columns";
import { EmailListTable } from "./emailListTable";

const EmailListDialog = () => {
  const { isEmailListOpen } = useAdminDashboardStore();

  const { closeELDialog, emailListData } =
    useEmailListDialog();


  return (
    <Dialog onOpenChange={closeELDialog} open={isEmailListOpen}>
      <DialogContent
        aria-describedby="dialog-description"
        className="flex flex-col sm:max-w-[500px] dialogBody"
      >
        <DialogHeader>
          <DialogTitle>Update Whitelisted Emails</DialogTitle>
          <div className="dialogDescription">
            <p className="subHeading">
              These email have been granted access to ScaleWorks
            </p>
            <EmailListTable columns={columns} data={emailListData} />
          </div>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  );
};

export default EmailListDialog;
