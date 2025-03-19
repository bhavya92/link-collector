
export const isFormInvalid = (err: Record<string, any>  | null | undefined): boolean  => {
  return !!err && Object.keys(err).length > 0;
}