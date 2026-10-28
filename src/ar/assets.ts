/**
 * Memeriksa apakah file aset benar-benar ada. Server dev/hosting SPA sering membalas `index.html`
 * (status 200) untuk file yang hilang, jadi `res.ok` saja tidak cukup: respons HTML dianggap "tidak ada".
 */
export async function assetExists(url: string, signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal, cache: 'no-store' })
    if (!res.ok) return false
    const type = res.headers.get('content-type') ?? ''
    return !type.includes('text/html')
  } catch {
    return false
  }
}
