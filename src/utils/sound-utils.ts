/**
 * for playing sounds
 */
export class SoundUtils {
  private static audioContext: AudioContext = new window.AudioContext();;

  /**
   * make class 'static'
   */
  private constructor() {
  }

  /**
   * @param path path of sound file to fetch
   */
  public static async getSoundFile(path: string): Promise<AudioBuffer> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    const soundFile = await fetch(path, {
      method: 'GET',
      headers: headers
    });

    return await this.audioContext.decodeAudioData((await soundFile.arrayBuffer()));
  }

  /**
   * @param audioBuffer audio buffer to loop
   */
  public static loopSong(audioBuffer: AudioBuffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer
    source.connect(this.audioContext.destination);
    source.loop = true;
    source.start();
    console.log(source.buffer.duration);
  }

  /**
   * @param audioBuffer audio buffer to play
   */
  public static playSong(audioBuffer: AudioBuffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer
    source.connect(this.audioContext.destination);
    source.start();
    console.log(source.buffer.duration);
  }
}