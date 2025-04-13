"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import "./cl.css";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import useCompanyLogoDialog from "@/hooks/useCompanyLogoDialog";
import { CompanyLogoTable } from "./companyLogoTable";

const CompanyLogoDialog = () => {
  const { isUpdateCompanyLogoOpen } = useAdminDashboardStore();

  const { closeCLDialog, companyTableData } =
  useCompanyLogoDialog();


  return (
    <Dialog onOpenChange={closeCLDialog} open={isUpdateCompanyLogoOpen}>
      <DialogContent
        aria-describedby="dialog-description"
        className="flex flex-col sm:max-w-[500px] dialogBody"
      >
        <DialogHeader>
          <DialogTitle>Update Companys' Logo</DialogTitle>
          <div className="dialogDescription">
            <p className="subHeading">
              Select and update the logo of ScaleWorks' users
            </p>
            <CompanyLogoTable data={companyTableData} />
          </div>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  );
};

export default CompanyLogoDialog;
