import { ClientError } from "nice-grpc-web";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import MemoView from "@/components/MemoView";
import UserAvatar from "@/components/UserAvatar";
import useNavigateTo from "@/hooks/useNavigateTo";
import { useMemoStore, useUserStore, useWorkspaceSettingStore } from "@/store/v1";
import { WorkspaceSettingKey } from "@/types/proto/store/workspace_setting";

const MemoEmbed = () => {
  const params = useParams();
  const navigateTo = useNavigateTo();
  const userStore = useUserStore();
  const memoStore = useMemoStore();
  const uid = params.uid;
  const memo = memoStore.getMemoByUid(uid || "");
  const [creator, setCreator] = useState(memo?.creator ? userStore.getUserByName(memo?.creator) : undefined);
  const workspaceSettingStore = useWorkspaceSettingStore();
  const domain = workspaceSettingStore.getWorkspaceSettingByKey(WorkspaceSettingKey.GENERAL).generalSetting?.customProfile?.domain;

  // Prepare memo.
  useEffect(() => {
    if (uid) {
      memoStore.fetchMemoByUid(uid).catch((error: ClientError) => {
        toast.error(error.details);
        navigateTo("/403");
      });
    } else {
      navigateTo("/404");
    }
  }, [uid]);

  // Initial related data: creator.
  useEffect(() => {
    (async () => {
      if (!memo?.creator) {
        return;
      }
      const user = await userStore.getOrFetchUserByName(memo.creator);
      setCreator(user);
    })();
  }, [memo?.creator]);

  return (
    <section className="w-full h-full flex flex-row justify-start items-start p-2">
      {memo && (
        <div className="w-full h-full flex flex-col relative">
          <MemoView
            key={`${memo.name}-${memo.displayTime}`}
            className="rounded-none hover:border-white transition-all mb-12"
            memo={memo}
            compact={false}
            showVisibility
            showPinned
            readonly
          />
          <div className="fixed bottom-0 flex flex-row justify-between items-center w-full bg-gray-100 dark:bg-zinc-700 py-4 px-6">
            <div className="flex flex-row justify-start items-center">
              <UserAvatar className="mr-2" avatarUrl={creator?.avatarUrl} />
              <div className="w-auto grow truncate flex mr-2 flex-col justify-center items-start">
                <span className="w-full text truncate font-medium text-gray-600 dark:text-gray-300">
                  {creator?.nickname || creator?.username}
                </span>
              </div>
            </div>
            <span className="text-gray-500 text-end max-sm:text-sm dark:text-gray-400">
              via {domain && domain !== "" ? domain : window.location.hostname}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default MemoEmbed;
