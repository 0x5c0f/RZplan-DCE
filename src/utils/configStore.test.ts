import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isUserAuthorized,
  POPULAR_PRESETS,
  maskApiKey,
} from './configStore';

test('isUserAuthorized correctly detects valid auth scenarios', () => {
  // Scenario 1: No auth, no custom model
  assert.equal(isUserAuthorized(null, null), false);
  assert.equal(isUserAuthorized('', null), false);

  // Scenario 2: Passcode provided
  assert.equal(isUserAuthorized('design-pro-2026', null), true);
  assert.equal(isUserAuthorized('my-secret-key', null), true);

  // Scenario 3: Custom model enabled
  assert.equal(
    isUserAuthorized(null, {
      enabled: true,
      baseUrl: 'https://api.deepseek.com',
      apiKey: 'sk-test123456',
      model: 'deepseek-flash',
    }),
    true
  );

  // Scenario 4: Custom model disabled or missing key
  assert.equal(
    isUserAuthorized(null, {
      enabled: false,
      baseUrl: 'https://api.deepseek.com',
      apiKey: 'sk-test123456',
      model: 'deepseek-flash',
    }),
    false
  );
  assert.equal(
    isUserAuthorized(null, {
      enabled: true,
      baseUrl: 'https://api.deepseek.com',
      apiKey: '',
      model: 'deepseek-flash',
    }),
    false
  );
});

test('maskApiKey securely redacts API keys', () => {
  assert.equal(maskApiKey(''), '');
  assert.equal(maskApiKey('sk-1234'), 'sk-••••••••');
  assert.equal(maskApiKey('sk-ant-api03-abcdefg123456789xyz'), 'sk-••••••••9xyz');
  assert.equal(maskApiKey('sk-deepseek-998877665544332211'), 'sk-••••••••2211');
});

test('POPULAR_PRESETS retains DeepSeek with deepseek-flash', () => {
  assert.equal(POPULAR_PRESETS.length, 1);
  const deepseek = POPULAR_PRESETS[0];
  assert.ok(deepseek);
  assert.equal(deepseek.name, 'DeepSeek');
  assert.equal(deepseek.defaultModel, 'deepseek-flash');
  assert.equal(deepseek.baseUrl, 'https://api.deepseek.com');
});
