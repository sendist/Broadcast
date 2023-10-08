import { BASE_URL } from "@/lib/constants";
import BulkUpload from "@/components/custom/bulkUpload";

type Props = {
  children: React.ReactNode;
  onSubmit: (file: File) => void;
};

export function AddMubalighBulk({ children, onSubmit }: Props) {
  return (
    <BulkUpload
      title="Upload Data Bulk"
      description="Input data mubaligh secara kolektif"
      templateUrl={`${BASE_URL}/mubaligh/template`}
      onSubmitFile={onSubmit}
    >
      {children}
    </BulkUpload>
  );
}
