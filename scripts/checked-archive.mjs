import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
/** Framework checks consume the exact archive that passed package:check, never a stale filename. */
export async function checkedArchive(version) {
  const result = JSON.parse(await readFile('artifacts/package-check.json', 'utf8'))
  assert.equal(result.version, version, 'Run package:check for this candidate first')
  assert.equal(result.result, 'passed')
  const actual = createHash('sha256')
    .update(await readFile(result.archive))
    .digest('hex')
  assert.equal(actual, result.sha256, 'The checked archive changed. Run package:check again.')
  return result.archive
}
