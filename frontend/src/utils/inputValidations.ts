import { FieldValues, UseFormGetValues } from 'react-hook-form'

export const userId_validation = {
  required: {
    value: true,
    message: 'required',
  },
}

export const email_validation = {
      required: {
        value: true,
        message: 'required',
      },
      pattern: {
        value:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'not valid',
      },
  }

  export const password_validation = {
      required: {
        value: true,
        message: 'required',
      },
      minLength: {
        value: 8,
        message: 'minimum 8 characters',
      },
  }

  export const password_repeat_validation = (getValues : UseFormGetValues<FieldValues>) => ({
    required: {
      value:true,
      message: 'required'
    },
    validate: (value : string) => value === getValues("password") || "Passwords do not match",
  });

  export const name_validation = {
      required: {
        value: true,
        message: 'required',
      },
      maxLength: {
        value: 30,
        message: '30 characters max',
      },
  }