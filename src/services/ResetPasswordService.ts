import axios from "axios";

export const resetPassword = async (token: string, newPassword: string, repetPassword: string) => {
  const response = await axios.patch(
    `http://localhost:3000/auth/reset-password?token=${token}`,
    {
      newPassword,
      repetPassword,
    }
  );
  return response.data;
};