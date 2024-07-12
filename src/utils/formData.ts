import * as qs from 'qs'

const formDataToQueryString = (formData: FormData) => {
  const params = new URLSearchParams()
  for (const [key, value] of formData) {
    params.append(key, value as string)
  }
  return params.toString()
}

export const formDataToObject = (formData: FormData) => {
  return qs.parse(formDataToQueryString(formData))
}
