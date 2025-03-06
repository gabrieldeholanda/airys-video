import { useCallback, useState } from "react";
import axios from "axios";
import { Button, buttonVariants } from "../ui/button";
import { isDesktop } from "react-device-detect";
import { HiTrash } from "react-icons/hi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import useKeyboardListener from "@/hooks/use-keyboard-listener";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type SearchActionGroupProps = {
  selectedObjects: string[];
  setSelectedObjects: (ids: string[]) => void;
  pullLatestData: () => void;
};
export default function SearchActionGroup({
  selectedObjects,
  setSelectedObjects,
  pullLatestData,
}: SearchActionGroupProps) {
  const { t: translate } = useTranslation(['ui']);
  const onClearSelected = useCallback(() => {
    setSelectedObjects([]);
  }, [setSelectedObjects]);

  const onDelete = useCallback(async () => {
    await axios
      .delete(`events/`, {
        data: { event_ids: selectedObjects },
      })
      .then((resp) => {
        if (resp.status == 200) {
          toast.success(translate('filter.search_actions.messages.success'), {
            position: "top-center",
          });
          setSelectedObjects([]);
          pullLatestData();
        }
      })
      .catch(() => {
        toast.error(translate('filter.search_actions.messages.error'), {
          position: "top-center",
        });
      });
  }, [selectedObjects, setSelectedObjects, pullLatestData, translate]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bypassDialog, setBypassDialog] = useState(false);

  useKeyboardListener(["Shift"], (_, modifiers) => {
    setBypassDialog(modifiers.shift);
  });

  const handleDelete = useCallback(() => {
    if (bypassDialog) {
      onDelete();
    } else {
      setDeleteDialogOpen(true);
    }
  }, [bypassDialog, onDelete]);

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(!deleteDialogOpen)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translate('filter.search_actions.dialog.delete.title')}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {translate('filter.search_actions.dialog.delete.description', { count: selectedObjects.length })}
            <br />
            <br />
            {translate('filter.search_actions.dialog.delete.confirm')}
            <br />
            <br />
            <span dangerouslySetInnerHTML={{ __html: translate('filter.search_actions.dialog.delete.bypass_hint') }} />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>{translate('filter.search_actions.dialog.delete.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={onDelete}
            >
              {translate('filter.search_actions.dialog.delete.actions.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="absolute inset-x-2 inset-y-0 flex items-center justify-between gap-2 bg-background py-2 md:left-auto">
        <div className="mx-1 flex items-center justify-center text-sm text-muted-foreground">
          <div className="p-1">{translate('filter.search_actions.selection.count', { count: selectedObjects.length })}</div>
          <div className="p-1">{"|"}</div>
          <div
            className="cursor-pointer p-2 text-primary hover:rounded-lg hover:bg-secondary"
            onClick={onClearSelected}
          >
            {translate('filter.search_actions.selection.unselect')}
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            className="flex items-center gap-2 p-2"
            aria-label={translate('filter.search_actions.actions.delete')}
            size="sm"
            onClick={handleDelete}
          >
            <HiTrash className="text-secondary-foreground" />
            {isDesktop && (
              <div className="text-primary">
                {bypassDialog ? translate('filter.search_actions.actions.delete_now') : translate('filter.search_actions.actions.delete')}
              </div>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
