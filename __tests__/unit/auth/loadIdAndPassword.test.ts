import { describe, afterEach, it, vi, expect } from 'vitest';
import fs from 'fs';
import { loadIdAndPassword } from '../../../src/auth/index';

describe('loadIdAndPassword 함수 테스트', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const secret = '{"id": "_user", "password": "_password"}';
  it('파일이 정상적으로 읽히는 경우', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue(secret);
    const result = loadIdAndPassword();
    expect(result).toEqual(JSON.parse(secret));
  });

  it('파일이 비어있는 경우', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('');
    const result = loadIdAndPassword();
    expect(result).toBe(false);
  });

  it('파일 읽기 오류 발생', () => {
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('파일 읽기 오류');
    });
    const result = loadIdAndPassword();
    expect(result).toBe(false);
  });
});
