"use client";

import { Button } from "@/components/ui/button";
import "@/styles/knowledge-base.css";
import { CircularProgress } from "@mui/material";


export const getColumns = (handleDelete, deletingKnowledge) => [
  {
    accessorKey: "file_name",
    header: "File Name",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <Button
          variant="destructive"
          onClick={() => handleDelete(id)}
          className="addNewKnowledge delete"
          style={{ pointerEvents: deletingKnowledge ? "none" : "auto" }}
        >
          { deletingKnowledge ? (<CircularProgress color="white" size="16px" />) : <p>Delete</p>}
        </Button>
      );
    },
  },
];