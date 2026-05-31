import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeXml, parseHexColor, generateRecommendations } from '../dist/server.js';

test('escapeXml escapes SVG-sensitive characters', () => {
  assert.equal(escapeXml('<hello & "world">'), '&lt;hello &amp; &quot;world&quot;&gt;');
});

test('parseHexColor accepts only six-digit hex colors', () => {
  assert.deepEqual(parseHexColor('#7c3aed'), { r: 124, g: 58, b: 237 });
  assert.equal(parseHexColor('7c3aed'), null);
  assert.equal(parseHexColor('#bad'), null);
});

test('generateRecommendations returns available theme keys', () => {
  const frontend = generateRecommendations({ isFrontend: true, activityLevel: 0.9 });
  const data = generateRecommendations({ isFrontend: false, isDataScientist: true, activityLevel: 0.2 });
  const student = generateRecommendations({ isFrontend: false, isDataScientist: false, isStudent: true, activityLevel: 0.2 });

  assert.equal(frontend.recommendedFrame, 'minimal');
  assert.equal(data.recommendedFrame, 'ocean');
  assert.equal(student.recommendedFrame, 'gitblaze');
  assert.ok(frontend.emojis.includes('🔥'));
});
