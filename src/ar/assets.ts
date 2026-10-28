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

/**
 * Awal file .mind MindAR 1.2.x: msgpack map `{ v: 2, dataList }` → byte `82 a1 76 02`.
 * Dipakai untuk membedakan file .mind asli dari file kosong / salah ekstensi / format versi lain.
 */
const MIND_V2_HEADER = [0x82, 0xa1, 0x76, 0x02]

/** Memeriksa keberadaan dan format file .mind tanpa mengunduh seluruh isinya. */
export async function checkMindFile(url: string, signal?: AbortSignal): Promise<'ready' | 'missing' | 'invalid'> {
  try {
    const res = await fetch(url, { signal, cache: 'no-store', headers: { Range: 'bytes=0-15' } })
    if (!res.ok) return 'missing'
    if ((res.headers.get('content-type') ?? '').includes('text/html')) return 'missing'
    const reader = res.body?.getReader()
    if (!reader) return 'invalid'
    const head: number[] = []
    while (head.length < MIND_V2_HEADER.length) {
      const { done, value } = await reader.read()
      if (done) break
      head.push(...value.subarray(0, MIND_V2_HEADER.length - head.length))
    }
    void reader.cancel().catch(() => {})
    return MIND_V2_HEADER.every((b, i) => head[i] === b) ? 'ready' : 'invalid'
  } catch {
    return signal?.aborted ? 'missing' : 'invalid'
  }
}

export type CompileRecord = {
  targets: { targetIndex: number; cardId: string }[]
}

/** Catatan kompilasi yang ditulis `npm run compile:targets` di samping file .mind; `null` bila tidak ada. */
export async function fetchCompileRecord(url: string, signal?: AbortSignal): Promise<CompileRecord | null> {
  try {
    const res = await fetch(url, { signal, cache: 'no-store' })
    if (!res.ok || (res.headers.get('content-type') ?? '').includes('text/html')) return null
    const data: unknown = await res.json()
    const targets = (data as { targets?: unknown }).targets
    if (!Array.isArray(targets)) return null
    return {
      targets: targets.filter(
        (t): t is CompileRecord['targets'][number] =>
          typeof t?.targetIndex === 'number' && typeof t?.cardId === 'string',
      ),
    }
  } catch {
    return null
  }
}
