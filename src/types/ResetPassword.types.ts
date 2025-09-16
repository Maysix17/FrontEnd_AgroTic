export interface ResetPasswordFormProps {
  onReset?: (password: string, token?: string) => void;
  token?: string;
}