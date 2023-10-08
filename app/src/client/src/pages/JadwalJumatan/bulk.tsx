import { BASE_URL } from "@/lib/constants";
import BulkUpload from "@/components/custom/bulkUpload";

type Props = {
  children: React.ReactNode;
  onSubmit: (file: File) => void;
};

export function AddJadwalJumatanBulk({ children, onSubmit }: Props) {
  return (
    <BulkUpload
      title="Upload Data Bulk"
      description="Input data jadwal jumatan secara kolektif"
      templateUrl={`${BASE_URL}/jadwal-jumatan/template`}
      onSubmitFile={onSubmit}
    >
      {children}
    </BulkUpload>
  );
}
