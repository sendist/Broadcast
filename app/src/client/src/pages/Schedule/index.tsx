import LoadingIcon from "@/assets/loadingIcon";
import InputDropdown from "@/components/custom/inputDropdown";
import CustomTooltip from "@/components/custom/tooltip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCRUD } from "@/hooks/backend";
import { compareObjectShallow } from "@/lib/utils";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type Schedule = {
  pengajian_bulanan: {
    active: boolean;
    h: number;
    jam: string;
    id_template: string;
  };
  pengajian_reminder: {
    active: boolean;
    force_broadcast: boolean;
    h: number;
    jam: string;
    id_template: string;
  };
  jumatan_reminder: {
    active: boolean;
    force_broadcast: boolean;
    h: number;
    jam: string;
    id_template: string;
  };
};

export default function SchedulePage() {
  const [noTemplateSelected, setNoTemplateSelected] = useState<
    (keyof Schedule)[]
  >([]);
  const { data, update } = useCRUD<Schedule>({
    url: "/schedule",
  }) as unknown as Omit<ReturnType<typeof useCRUD<Schedule>>, "data"> & {
    data: Schedule;
  };
  const { data: template } = useCRUD<{
    id: string;
    content: string;
    nama_template: string;
    type: keyof Schedule;
  }>({
    url: "/template",
    params: {
      fields: "id,content,nama_template,type",
    },
  });
  const templateDropdown = template?.map((item) => ({
    label: item.nama_template,
    value: item.id,
    type: item.type,
  }));

  const [schedule, setSchedule] = useState<Schedule>({
    pengajian_bulanan: {
      active: false,
      h: 0,
      jam: "00:00",
      id_template: "",
    },
    pengajian_reminder: {
      active: false,
      force_broadcast: false,
      h: 0,
      jam: "00:00",
      id_template: "",
    },
    jumatan_reminder: {
      active: false,
      force_broadcast: false,
      h: 0,
      jam: "00:00",
      id_template: "",
    },
  });
  const [unsavedChanges, setUnsavedChanges] = useState<
    Record<
      keyof Schedule,
      {
        changed: boolean;
        saving: boolean;
        prev: Schedule[keyof Schedule];
      }
    >
  >({
    pengajian_bulanan: {
      changed: false,
      saving: false,
      prev: {
        active: false,
        h: 0,
        jam: "00:00",
        id_template: "",
      },
    },
    pengajian_reminder: {
      changed: false,
      saving: false,
      prev: {
        active: false,
        force_broadcast: false,
        h: 0,
        jam: "00:00",
        id_template: "",
      },
    },
    jumatan_reminder: {
      changed: false,
      saving: false,
      prev: {
        active: false,
        force_broadcast: false,
        h: 0,
        jam: "00:00",
        id_template: "",
      },
    },
  });

  function changeSchedule<T extends keyof typeof schedule>(
    type: T,
    key: keyof (typeof schedule)[T],
    value: (typeof schedule)[T][keyof (typeof schedule)[T]]
  ) {
    setUnsavedChanges((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        changed: !compareObjectShallow(
          { ...schedule[type], [key]: value },
          prev[type].prev
        ),
      },
    }));

    setSchedule((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  }

  function save(id: keyof Schedule) {
    //check if template is selected for the first time using schedule
    if (!schedule[id].id_template) {
      setNoTemplateSelected((prev) => [...prev, id]);
      return;
    }
    setNoTemplateSelected((prev) => prev.filter((item) => item !== id));

    setUnsavedChanges((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        saving: true,
      },
    }));
    update(id, schedule[id] as Partial<Schedule>, false).then(
      ({ data, error }) => {
        if (error) {
          console.error(error);
          setUnsavedChanges((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              saving: false,
            },
          }));
          return;
        }
        setUnsavedChanges((prev) => ({
          ...prev,
          [id]: {
            changed: false,
            saving: false,
            prev: data,
          },
        }));
        setSchedule((prev) => ({
          ...prev,
          [id]: data,
        }));
      }
    );
  }

  function discard(id: keyof Schedule) {
    setUnsavedChanges((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        changed: false,
      },
    }));
    setSchedule((prev) => ({
      ...prev,
      [id]: unsavedChanges[id].prev,
    }));
  }

  useEffect(() => {
    if (data) {
      setSchedule(data);
      setUnsavedChanges(
        Object.keys(data).reduce((acc, curr) => {
          acc[curr as keyof Schedule] = {
            changed: false,
            saving: false,
            prev: data[curr as keyof Schedule],
          };
          return acc;
        }, {} as Record<keyof Schedule, { changed: boolean; saving: boolean; prev: Schedule[keyof Schedule] }>)
      );
    }
  }, [data]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="inline-block text-xl font-semibold">Schedule</h1>
      </div>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row gap-4 items-center">
            <Switch
              checked={schedule.pengajian_bulanan.active}
              onCheckedChange={(checked) => {
                changeSchedule("pengajian_bulanan", "active", checked);
              }}
            />
            <div>
              <CardTitle>Jadwal Pengajian Bulanan</CardTitle>
              <CardDescription>
                Atur schedule untuk jadwal pengajian bulanan
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div>
              Kirim jadwal pengajian bulanan setiap H-{" "}
              <Input
                type="number"
                min="0"
                max="30"
                className="w-16 inline-block"
                value={schedule.pengajian_bulanan.h}
                onChange={(e) =>
                  changeSchedule(
                    "pengajian_bulanan",
                    "h",
                    Number(e.target.value)
                  )
                }
              />
              <CustomTooltip content="H-0 berarti tepat tanggal 1 bulan tersebut">
                <QuestionMarkCircledIcon className="inline-block w-5 h-5 text-muted-foreground mx-2" />
              </CustomTooltip>
              awal bulan pada jam{" "}
              <Input
                type="time"
                className="w-fit inline-block"
                value={schedule.pengajian_bulanan.jam}
                onChange={(e) =>
                  changeSchedule("pengajian_bulanan", "jam", e.target.value)
                }
              />{" "}
              dengan template{" "}
              <InputDropdown
                value={
                  templateDropdown?.find(
                    (item) =>
                      item.value === schedule.pengajian_bulanan.id_template
                  )?.value || ""
                }
                select={
                  templateDropdown?.filter(
                    (item) => item.type === "pengajian_bulanan"
                  ) || []
                }
                onChange={(value) => {
                  changeSchedule(
                    "pengajian_bulanan",
                    "id_template",
                    value as string
                  );
                }}
              />
            </div>
            {unsavedChanges.pengajian_bulanan.changed && (
              <>
                <Separator />
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    disabled={unsavedChanges.pengajian_bulanan.saving}
                    onClick={() => discard("pengajian_bulanan")}
                  >
                    Discard
                  </Button>
                  <Button
                    onClick={() => save("pengajian_bulanan")}
                    disabled={unsavedChanges.pengajian_bulanan.saving}
                  >
                    {unsavedChanges.pengajian_bulanan.saving ? (
                      <>
                        <LoadingIcon /> Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
                {noTemplateSelected.includes("pengajian_bulanan") && (
                  <p className="text-red-600">
                    Mohon pilih template sebelum menyimpan
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row gap-4 items-center">
            <Switch
              checked={schedule.pengajian_reminder.active}
              onCheckedChange={(checked) => {
                changeSchedule("pengajian_reminder", "active", checked);
              }}
            />
            <div>
              <CardTitle>Jadwal Pengajian Harian</CardTitle>
              <CardDescription>
                Atur schedule untuk jadwal pengajian harian
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-2">
              Tetap broadcast jadwal yang sudah di broadcast{" "}
              <Switch
                checked={schedule.pengajian_reminder.force_broadcast}
                onCheckedChange={(checked) => {
                  changeSchedule(
                    "pengajian_reminder",
                    "force_broadcast",
                    checked
                  );
                }}
              />{" "}
              <CustomTooltip
                content={
                  'Jadwal dengan status "Sudah Broadcast" akan tetap dikirim sesuai jadwal'
                }
              >
                <QuestionMarkCircledIcon className="inline-block w-5 h-5 text-muted-foreground mx-2" />
              </CustomTooltip>
            </div>
            <div>
              Kirim jadwal pengajian setiap H-{" "}
              <Input
                type="number"
                min="0"
                max="30"
                className="w-16 inline-block"
                onChange={(e) => {
                  changeSchedule(
                    "pengajian_reminder",
                    "h",
                    Number(e.target.value)
                  );
                }}
                value={schedule.pengajian_reminder.h}
              />
              <CustomTooltip content="H-0 berarti tepat pada hari jadwal pengajian tersebut">
                <QuestionMarkCircledIcon className="inline-block w-5 h-5 text-muted-foreground mx-2" />
              </CustomTooltip>{" "}
              pada jam{" "}
              <Input
                type="time"
                className="w-fit inline-block"
                value={schedule.pengajian_reminder.jam}
                onChange={(e) => {
                  changeSchedule("pengajian_reminder", "jam", e.target.value);
                }}
              />{" "}
              dengan template{" "}
              <InputDropdown
                value={
                  templateDropdown?.find(
                    (item) =>
                      item.value === schedule.pengajian_reminder.id_template
                  )?.value || ""
                }
                select={
                  templateDropdown?.filter(
                    (item) => item.type === "pengajian_reminder"
                  ) || []
                }
                onChange={(value) => {
                  changeSchedule(
                    "pengajian_reminder",
                    "id_template",
                    value as string
                  );
                }}
              />
            </div>
            {unsavedChanges.pengajian_reminder.changed && (
              <>
                <Separator />
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    disabled={unsavedChanges.pengajian_reminder.saving}
                    onClick={() => discard("pengajian_reminder")}
                  >
                    Discard
                  </Button>
                  <Button
                    onClick={() => save("pengajian_reminder")}
                    disabled={unsavedChanges.pengajian_reminder.saving}
                  >
                    {unsavedChanges.pengajian_reminder.saving ? (
                      <>
                        <LoadingIcon /> Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
                {noTemplateSelected.includes("pengajian_reminder") && (
                  <p className="text-red-600">
                    Mohon pilih template sebelum menyimpan
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row gap-4 items-center">
            <Switch
              checked={schedule.jumatan_reminder.active}
              onCheckedChange={(checked) => {
                changeSchedule("jumatan_reminder", "active", checked);
              }}
            />
            <div>
              <CardTitle>Jadwal Jumatan</CardTitle>
              <CardDescription>
                Atur schedule untuk jadwal jumatan harian
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-2">
              Tetap broadcast jadwal yang sudah di broadcast{" "}
              <Switch
                checked={schedule.jumatan_reminder.force_broadcast}
                onCheckedChange={(checked) => {
                  changeSchedule(
                    "jumatan_reminder",
                    "force_broadcast",
                    checked
                  );
                }}
              />{" "}
              <CustomTooltip
                content={
                  'Jadwal dengan status "Sudah Broadcast" akan tetap dikirim sesuai jadwal'
                }
              >
                <QuestionMarkCircledIcon className="inline-block w-5 h-5 text-muted-foreground mx-2" />
              </CustomTooltip>
            </div>
            <div>
              Kirim jadwal jumatan setiap H-{" "}
              <Input
                type="number"
                min="0"
                max="30"
                className="w-16 inline-block"
                value={schedule.jumatan_reminder.h}
                onChange={(e) => {
                  changeSchedule(
                    "jumatan_reminder",
                    "h",
                    Number(e.target.value)
                  );
                }}
              />
              <CustomTooltip content="H-0 berarti tepat pada hari jumat">
                <QuestionMarkCircledIcon className="inline-block w-5 h-5 text-muted-foreground mx-2" />
              </CustomTooltip>{" "}
              pada jam{" "}
              <Input
                type="time"
                className="w-fit inline-block"
                value={schedule.jumatan_reminder.jam}
                onChange={(e) => {
                  changeSchedule("jumatan_reminder", "jam", e.target.value);
                }}
              />{" "}
              dengan template{" "}
              <InputDropdown
                value={
                  templateDropdown?.find(
                    (item) =>
                      item.value === schedule.jumatan_reminder.id_template
                  )?.value || ""
                }
                select={
                  templateDropdown?.filter(
                    (item) => item.type === "jumatan_reminder"
                  ) || []
                }
                onChange={(value) => {
                  changeSchedule(
                    "jumatan_reminder",
                    "id_template",
                    value as string
                  );
                }}
              />
            </div>
            {unsavedChanges.jumatan_reminder.changed && (
              <>
                <Separator />
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    disabled={unsavedChanges.jumatan_reminder.saving}
                    onClick={() => discard("jumatan_reminder")}
                  >
                    Discard
                  </Button>
                  <Button
                    onClick={() => save("jumatan_reminder")}
                    disabled={unsavedChanges.jumatan_reminder.saving}
                  >
                    {unsavedChanges.jumatan_reminder.saving ? (
                      <>
                        <LoadingIcon /> Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
                {noTemplateSelected.includes("jumatan_reminder") && (
                  <p className="text-red-600">
                    Mohon pilih template sebelum menyimpan
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
