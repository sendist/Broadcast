import { BASE_URL } from "@/lib/constants";
import BulkUpload from "@/components/custom/bulkUpload";

type Props = {
  children: React.ReactNode;
  onSubmit: (file: File) => void;
};

export function AddMasjidBulk({ children, onSubmit }: Props) {

  return (
    <BulkUpload
      title="Upload Data Bulk"
      description="Input data masjid secara kolektif"
      templateUrl={`${BASE_URL}/masjid/template`}
      onSubmitFile={onSubmit}
    >
      {children}
    </BulkUpload>
  );
}
