import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const appSource = new URL('../client/src/App.jsx', import.meta.url);

test('dashboard source does not reference removed studio navigation globals', async () => {
  const source = await readFile(appSource, 'utf8');

  assert.equal(source.includes('STUDIO_NAV_ITEMS'), false);
  assert.equal(source.includes('studio-navbar'), false);
  assert.equal(source.includes('scrollToSection'), false);
});
