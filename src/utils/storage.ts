export const setAuthData = (
    token: string,
    user: unknown
  ) => {
    localStorage.setItem("token", token)
  
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    )
  }
  
  export const clearAuthData = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }