// export const isValidURL = (url: string) => {
//   try {
//     new URL(url)
//     return true
//   } catch {
//     return false
//   }
// }

// lib/validators.ts

// export function isValidURL(url: string): boolean {
//   try {
//     const parsed = new URL(url)
//     return parsed.protocol === 'http:' || parsed.protocol === 'https:'
//   } catch {
//     return false
//   }
// }
// export function normalizeURL(url: string): string {
//   if (!/^https?:\/\//i.test(url)) {
//     return 'https://' + url
//   }
//   return url
// }

export function isValidUrl(url: string): boolean {
  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
}

