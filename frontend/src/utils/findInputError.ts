import { FieldErrors } from "react-hook-form";

export const findInputErrors = (errors: FieldErrors, name:string) => {
  const error = errors[name] as { message?: string } | undefined;
  return error ? { error } : {};
}