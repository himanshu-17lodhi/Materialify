import { Mock, describe, expect, it, vi } from 'vitest';
import twemoji from '@twemoji/api';
import emoji from '@/emoji';

vi.mock('@twemoji/api');

describe('isEmoji', () => {
  it('should return `true` for valid emojis', () => {
    expect(emoji.isEmoji('👍')).toBe(true);
    expect(emoji.isEmoji('🇺🇸')).toBe(true);
    expect(emoji.isEmoji('🤔')).toBe(true);
    expect(emoji.isEmoji('😂')).toBe(true);
    expect(emoji.isEmoji('👍🏼')).toBe(true);
    expect(emoji.isEmoji('😂😂')).toBe(true);
  });

  it('should return `false` for invalid emojis', () => {
    expect(emoji.isEmoji('hello')).toBe(false);
    expect(emoji.isEmoji('123')).toBe(false);
    expect(emoji.isEmoji('*')).toBe(false);
    expect(emoji.isEmoji('-')).toBe(false);
    expect(emoji.isEmoji('#')).toBe(false);
    expect(emoji.isEmoji('+')).toBe(false);
  });
});

describe('getShortcode', () => {
  it('should replace whitespaces with underscores', () => {
    expect(emoji.getShortcode('👍')).toBe('thumbs_up');
    expect(emoji.getShortcode('🤔')).toBe('thinking_face');
    expect(emoji.getShortcode('😂')).toBe('face_with_tears_of_joy');
  });

  it('should replace colons with an empty string', () => {
    expect(emoji.getShortcode('🇺🇸')).toBe('flag_united_states');
    expect(emoji.getShortcode('🏴󠁧󠁢󠁥󠁮󠁧󠁿')).toBe('flag_england');
  });

  it('should return `undefined` for invalid emojis', () => {
    expect(emoji.getShortcode('hello')).toBe(undefined);
    expect(emoji.getShortcode('123')).toBe(undefined);
    expect(emoji.getShortcode('🤗 hello')).toBe(undefined);
    expect(emoji.getShortcode('hello 🤗')).toBe(undefined);
  });
});

describe('parseEmoji', () => {
  it('should return emoji when emojiStyle is `native`', () => {
    expect(emoji.parseEmoji('native', '👍')).toBe('👍');
    expect(emoji.parseEmoji('native', '🤔')).toBe('🤔');
    expect(emoji.parseEmoji('native', '😂')).toBe('😂');
  });

  it('should call twemoji.parse when emojiStyle is `twemoji`', () => {
    (twemoji.parse as Mock).mockImplementation(() => '👍');
    emoji.parseEmoji('twemoji', '👍');
    expect(twemoji.parse).toHaveBeenCalledTimes(1);
  });
});
