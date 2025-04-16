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
import { Info } from "lucide-react";

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
            <div className="description_subHeader">
              <p className="cld_subHeading">
                Select and update the logo of ScaleWorks' users
              </p>
              <div className="pageTitle_subInfo_cld">
                <Info size={16} />
                <p className="pageTitle_subInfo_text_cld">
                  Max file size: 10MB
                </p>
              </div>
            </div>
            <CompanyLogoTable data={companyTableData} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLogoDialog;
