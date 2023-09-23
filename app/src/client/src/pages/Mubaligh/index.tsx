import { Checkbox } from "@/components/ui/checkbox";
import { useCRUD } from "@/hooks/backend";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

export default function Mubaligh() {
  const { data } = useCRUD({
    url: "/mubaligh",
  });

  const [checked, setChecked] = useState<CheckedState>(false);

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
      <Checkbox
        checked={checked}
        onCheckedChange={(checked) => {
          setChecked(checked);
          console.log(checked);
        }}
      />
    </div>
  );
}
