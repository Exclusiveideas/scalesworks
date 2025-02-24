"use client";

import { AppSidebar } from "@/components/appSideBar";
import "./eDiscovery.css";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";

import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FileUpload } from "primereact/fileupload";

const EDiscovery = () => {
  const { toggleSidebar } = useSidebar();

  const [inputValue, setInputValue] = useState("");
  const [addFileInactive, setAddFileInactive] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streamingData, setStreamingData] = useState("");

  const sendMessage = () => {};
  const closeStreaming = () => {};
  const addFile = () => {};

  const router = useRouter();
  const { user } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);

  const allowedFileTypes = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "text/plain", // .txt
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "text/csv", // .csv
    "text/markdown", // .md
  ];


const handleUpload = async (event) => {
  const file = event.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Uploaded file URL:", data.url);
    } else {
      // alert(`Upload failed: ${data.error}`);
    }
  } catch (error) {
    console.error("Upload error:", error);
  }
};

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth"); // Redirect only after hydration
    }
  }, [user, isHydrated]);

  return (
    <div className="eDiscovery_wrapper">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="sideBar_trigger">
            <PanelRightOpen />
          </div>
        </div>
        <div className="pageBody">
          <div className="modelTitle_container_e-discovery">E-Discovery</div>
        </div>
        <div className="interaction_area">
          <div className="inputbox">
            <Input
              type="text"
              placeholder="Ask anything (must attach a file for discovery)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
              className="legalAsst_input"
            />
            <Dialog>
              <DialogTrigger>
                <div
                  onClick={addFile}
                  className={`addFileBtn ${addFileInactive && "inActive"}`}
                >
                  <Plus />
                </div>
              </DialogTrigger>
              <DialogContent className="dialogContent">
                <DialogHeader className="dialogHeader">
                  <DialogTitle className="dialogTitle">
                    Upload a file
                  </DialogTitle>
                  <DialogDescription>
                    Select a file you want to analyze
                  </DialogDescription>
                </DialogHeader>
                <div className="uploadFile">
                  <div className="card">
                    <FileUpload
                      name="file"
                      url="/api/upload"
                      mode="advanced"
                      accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.md"
                      maxFileSize={1000000}
                      auto={false}
                      customUpload
                      uploadHandler={handleUpload}
                      chooseLabel="Select File"
                      emptyTemplate={
                        <p className="m-0">Drag and drop a file here.</p>
                      }
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {!streamingData ? (
              <div
                onClick={sendMessage}
                className={`sendBtn ${sendBtnActive && "active"}`}
              >
                <Send />
              </div>
            ) : (
              <div onClick={closeStreaming} className="stopBtn">
                <StopCircleOutlinedIcon sx={{ fontSize: 30 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDiscovery;
