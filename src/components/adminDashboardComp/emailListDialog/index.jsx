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

  const { isLoading, closeELDialog, error, emailListData } =
    useEmailListDialog();

//   useEffect(() => {
//     setDummyState(prev => !prev)
//     console.log('emailListData: ', emailListData)
//   }, [emailListData]);

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

        {error && <p className="kb_errorTxt">{error}</p>}
        {/* <DialogFooter className="dialogFooter">
          <Button variant="outline" onClick={closeELDialog}>
            Cancel
          </Button>
          <Button onClick={() => {}} disabled={isLoading}>
            {isLoading ? (
              <CircularProgress color="black" size="17px" />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default EmailListDialog;
