export interface ApiUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  message: string
  token: string
  user: ApiUser
}

export interface ApiMessage {
  role: "user" | "assistant"
  content: string
  tool?: string | null
}

export interface ApiChat {
  _id: string
  title: string
  createdAt: string
  updatedAt?: string
  messages: ApiMessage[]
}

export interface SendMessageResponse {
  tool: string | null
  response: string
}

export interface UploadAnalysisResponse {
  filename: string
  analysis: string
}

export interface ApiErrorBody {
  message?: string
}
