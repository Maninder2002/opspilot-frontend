import api from "@/utils/api/client"

import type { UploadAnalysisResponse } from "@/utils/api/types"

export const uploadApi = {
  analyzeLog: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    return api.post<UploadAnalysisResponse>(
      "/upload/analyze",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    )
  },
}

export type { UploadAnalysisResponse }
