import { ref, computed, Ref } from "vue";
import {
  FileInfo,
  FileInfoMap,
  FileStatusEnum,
  StatusFileInfoMap,
} from "./getFileContent";

export function useGetFileCompare(
  oldFiles: Ref<FileInfoMap>,
  newFiles: Ref<FileInfoMap>
) {
  const compareFile = computed(() => {
    const typeFile: StatusFileInfoMap = new Map();
    for (const [path, infoStatus] of newFiles.value) {
      const file = oldFiles.value.get(path);
      const info = infoStatus;
      if (file) {
        if (file.content !== info.content) {
          typeFile.set(path, {
            newFile: info,
            oldFile: file,
            status: FileStatusEnum.change,
          });
        } else {
          typeFile.set(path, {
            newFile: info,
            oldFile: file,
            status: FileStatusEnum.noChange,
          });
        }
      } else {
        typeFile.set(path, {
          newFile: info,
          status: FileStatusEnum.add,
        });
      }
    }
    for (const [path, info] of oldFiles.value) {
      const file = newFiles.value.get(path);
      if (!file) {
        typeFile.set(path, {
          status: FileStatusEnum.del,
          oldFile: info,
        });
      }
    }
    return typeFile;
  });
  return compareFile;
}
