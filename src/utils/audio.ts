type AudioOptions =
  | {
      loop?: boolean;
      volume?: number;
      playbackRate?: number;
      autoplay?: boolean;
    }
  | undefined;

export function playLocalAudio(filePath: string, options?: AudioOptions) {
  const audio = new Audio(filePath);
  audio.play();
  audio.loop = options?.loop ?? false;
  audio.volume = options?.volume ?? 1;
  audio.playbackRate = options?.playbackRate ?? 1;
  audio.autoplay = options?.autoplay ?? false;
  return audio;
}
