import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmDelete({ isOpen, onClose, onConfirm, title, description, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">{title || "Confirm Deletion"}</h3>
          <p className="mb-6 text-sm text-slate-500">
            {description || "Are you sure you want to delete this item? This action cannot be undone."}
          </p>
          <div className="flex w-full gap-3 sm:flex-row flex-col">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
