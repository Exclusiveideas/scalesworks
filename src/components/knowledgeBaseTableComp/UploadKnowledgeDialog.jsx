"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./kb.css";
import CircularProgress from "@mui/material/CircularProgress";
import useDialogStore from "@/store/useDialogStore";
import useKnowledgeBase from "@/hooks/useKnowledgeBase";


// Allowed file types
const allowedFileTypesExt = [".pdf", ".doc", ".docx", ".txt", ".xlsx", ".csv", ".md"];

export default function UploadKnowledgeDialog() {
  const { isOpen } = useDialogStore();

  const {
    isLoading,
    uploadKnowledge,
    closeKBDialog,
    handleFileChange,
    selectedFiles,
    fileInputRef,
    error,
  } = useKnowledgeBase();

  return (
    <Dialog open={isOpen}>
      <DialogContent aria-describedby="dialog-description" className="[&>button]:hidden flex flex-col sm:max-w-[500px] dialogBody">
        <DialogHeader>
          <DialogTitle>
            Upload files to your organization's knowledge base
          </DialogTitle>
          <DialogDescription>
            Accepted file formats: {allowedFileTypesExt?.join(", ")}
            {selectedFiles.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                <strong>Selected Files:</strong> {selectedFiles?.map(file => file?.name).join(", ")}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Hidden File Input */}
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          className="hidden-input"
        />

        {error && <p className="kb_errorTxt">{error}</p>}
        <DialogFooter className="dialogFooter">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current.click()}
          >
            Select
          </Button>
          <Button variant="outline" onClick={closeKBDialog}>
            Cancel
          </Button>
          <Button onClick={uploadKnowledge} disabled={isLoading}>
            {isLoading ? (
              <CircularProgress color="black" size="17px" />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
