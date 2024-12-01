import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: string[];
  headers: string[];
}

export function DetailDialog({
  isOpen,
  onClose,
  data,
  headers,
}: DetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Registro</DialogTitle>
          <DialogDescription>
            Informações completas do registro selecionado
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {headers.map((header, index) => (
            <div key={index} className="space-y-1">
              <h4 className="font-medium text-sm">{header}</h4>
              <p className="text-sm text-gray-500">{data[index] || "N/A"}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
