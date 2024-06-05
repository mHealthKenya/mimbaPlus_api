export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneRegex = /^254[0-9]{9}$/

export const combinedRegex = new RegExp(emailRegex.source + '|' + phoneRegex.source);