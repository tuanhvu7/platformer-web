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
   * @return new AudioBufferSourceNode with buffer set to given audioBuffer
   * used to replay songs
   */
  public static createAudioBufferSourceNode(audioBuffer: AudioBuffer): AudioBufferSourceNode {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    return source;
  }

  /**
   * @param audioBufferSourceNode audio buffer source node to loop
   */
  public static loopSong(audioBufferSourceNode: AudioBufferSourceNode): void {
    audioBufferSourceNode.connect(this.audioContext.destination);
    audioBufferSourceNode.loop = true;
    audioBufferSourceNode.start();
    console.log(audioBufferSourceNode.buffer.duration);
  }

  /**
   * @param audioBufferSourceNode audio buffer source node to play
   */
  public static playSong(audioBufferSourceNode: AudioBufferSourceNode): void {
    audioBufferSourceNode.connect(this.audioContext.destination);
    audioBufferSourceNode.loop = true;
    audioBufferSourceNode.start();
    console.log(audioBufferSourceNode.buffer.duration);
  }
}