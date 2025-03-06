import { useState, ReactNode } from "react";
import { SearchResult } from "@/types/search";
import { FrigateConfig } from "@/types/frigateConfig";
import { baseUrl } from "@/api/baseUrl";
import { toast } from "sonner";
import axios from "axios";
import { LuCamera, LuDownload, LuMoreVertical, LuTrash2 } from "react-icons/lu";
import { FaArrowsRotate } from "react-icons/fa6";
import { MdImageSearch } from "react-icons/md";
import FrigatePlusIcon from "@/components/icons/FrigatePlusIcon";
import { isMobileOnly } from "react-device-detect";
import { buttonVariants } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSWR from "swr";
import { useTranslation } from "react-i18next";

type SearchResultActionsProps = {
  searchResult: SearchResult;
  findSimilar: () => void;
  refreshResults: () => void;
  showObjectLifecycle: () => void;
  showSnapshot: () => void;
  isContextMenu?: boolean;
  children?: ReactNode;
};

export default function SearchResultActions({
  searchResult,
  findSimilar,
  refreshResults,
  showObjectLifecycle,
  showSnapshot,
  isContextMenu = false,
  children,
}: SearchResultActionsProps) {
  const { t: translate } = useTranslation(['ui']);
  const { data: config } = useSWR<FrigateConfig>("config");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    axios
      .delete(`events/${searchResult.id}`)
      .then((resp) => {
        if (resp.status == 200) {
          toast.success(translate('menu.search.messages.delete.success'), {
            position: "top-center",
          });
          refreshResults();
        }
      })
      .catch(() => {
        toast.error(translate('menu.search.messages.delete.error'), {
          position: "top-center",
        });
      });
  };

  const MenuItem = isContextMenu ? ContextMenuItem : DropdownMenuItem;

  const menuItems = (
    <>
      {searchResult.has_clip && (
        <MenuItem aria-label={translate('menu.search.actions.download.video')}>
          <a
            className="flex items-center"
            href={`${baseUrl}api/events/${searchResult.id}/clip.mp4`}
            download={`${searchResult.camera}_${searchResult.label}.mp4`}
          >
            <LuDownload className="mr-2 size-4" />
            <span>{translate('menu.search.actions.download.video')}</span>
          </a>
        </MenuItem>
      )}
      {searchResult.has_snapshot && (
        <MenuItem aria-label={translate('menu.search.actions.download.snapshot')}>
          <a
            className="flex items-center"
            href={`${baseUrl}api/events/${searchResult.id}/snapshot.jpg`}
            download={`${searchResult.camera}_${searchResult.label}.jpg`}
          >
            <LuCamera className="mr-2 size-4" />
            <span>{translate('menu.search.actions.download.snapshot')}</span>
          </a>
        </MenuItem>
      )}
      {searchResult.data.type == "object" && (
        <MenuItem
          aria-label={translate('menu.search.actions.view_lifecycle')}
          onClick={showObjectLifecycle}
        >
          <FaArrowsRotate className="mr-2 size-4" />
          <span>{translate('menu.search.actions.view_lifecycle')}</span>
        </MenuItem>
      )}
      {config?.semantic_search?.enabled && isContextMenu && (
        <MenuItem
          aria-label={translate('menu.search.actions.find_similar')}
          onClick={findSimilar}
        >
          <MdImageSearch className="mr-2 size-4" />
          <span>{translate('menu.search.actions.find_similar')}</span>
        </MenuItem>
      )}
      {isMobileOnly &&
        config?.plus?.enabled &&
        searchResult.has_snapshot &&
        searchResult.end_time &&
        searchResult.data.type == "object" &&
        !searchResult.plus_id && (
          <MenuItem aria-label={translate('menu.search.actions.submit_plus')} onClick={showSnapshot}>
            <FrigatePlusIcon className="mr-2 size-4 cursor-pointer text-primary" />
            <span>{translate('menu.search.actions.submit_plus')}</span>
          </MenuItem>
        )}
      <MenuItem
        aria-label={translate('menu.search.actions.delete')}
        onClick={() => setDeleteDialogOpen(true)}
      >
        <LuTrash2 className="mr-2 size-4" />
        <span>{translate('menu.search.actions.delete')}</span>
      </MenuItem>
    </>
  );

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(!deleteDialogOpen)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translate('menu.search.delete_dialog.title')}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {translate('menu.search.delete_dialog.description')}
            <br />
            <br />
            {translate('menu.search.delete_dialog.confirm')}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>{translate('menu.search.delete_dialog.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
            >
              {translate('menu.search.delete_dialog.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isContextMenu ? (
        <ContextMenu>
          <ContextMenuTrigger>{children}</ContextMenuTrigger>
          <ContextMenuContent>{menuItems}</ContextMenuContent>
        </ContextMenu>
      ) : (
        <>
          {config?.semantic_search?.enabled &&
            searchResult.data.type == "object" && (
              <Tooltip>
                <TooltipTrigger>
                  <MdImageSearch
                    className="size-5 cursor-pointer text-primary-variant hover:text-primary"
                    onClick={findSimilar}
                  />
                </TooltipTrigger>
                <TooltipContent>{translate('menu.search.actions.find_similar')}</TooltipContent>
              </Tooltip>
            )}

          {!isMobileOnly &&
            config?.plus?.enabled &&
            searchResult.has_snapshot &&
            searchResult.end_time &&
            searchResult.data.type == "object" &&
            !searchResult.plus_id && (
              <Tooltip>
                <TooltipTrigger>
                  <FrigatePlusIcon
                    className="size-5 cursor-pointer text-primary-variant hover:text-primary"
                    onClick={showSnapshot}
                  />
                </TooltipTrigger>
                <TooltipContent>{translate('menu.search.actions.submit_plus')}</TooltipContent>
              </Tooltip>
            )}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <LuMoreVertical className="size-5 cursor-pointer text-primary-variant hover:text-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{menuItems}</DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </>
  );
}
