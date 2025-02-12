import { BASE_URL } from "@/lib/constants";
import BulkUpload from "@/components/custom/bulkUpload";

type Props = {
  children: React.ReactNode;
  onSubmit: (file: File) => void;
};

export function AddJamaahBulk({ children, onSubmit }: Props) {

  return (
    <BulkUpload
      title="Upload Data Bulk"
      description="Input data jamaah secara kolektif"
      templateUrl={`${BASE_URL}/jamaah/template`}
      onSubmitFile={onSubmit}
    >
      {children}
    </BulkUpload>
  );
}
