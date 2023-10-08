import { BASE_URL } from "@/lib/constants";
import BulkUpload from "@/components/custom/bulkUpload";

type Props = {
  children: React.ReactNode;
  onSubmit: (file: File) => void;
};

export function AddJadwalPengajianBulk({ children, onSubmit }: Props) {
  return (
    <BulkUpload
      title="Upload Data Bulk"
      description="Input data jadwal pengajian secara kolektif"
      templateUrl={`${BASE_URL}/jadwal-pengajian/template`}
      onSubmitFile={onSubmit}
    >
      {children}
    </BulkUpload>
  );
}
