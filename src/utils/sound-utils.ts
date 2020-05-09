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
  public static async getSoundFile(path: string): Promise<AudioBufferSourceNode> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    const soundFile = await fetch(path, {
      method: 'GET',
      headers: headers
    });

    const audioBuffer = await this.audioContext.decodeAudioData((await soundFile.arrayBuffer()));
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    return source;
  }

  /**
   * @param audioBufferSourceNode audio buffer source node to loop
   */
  public static loopSong(audioBufferSourceNode: AudioBufferSourceNode) {
    audioBufferSourceNode.loop = true;
    audioBufferSourceNode.start();
    console.log(audioBufferSourceNode.buffer.duration);
  }

  /**
   * @param audioBufferSourceNode audio buffer source node to play
   */
  public static playSong(audioBufferSourceNode: AudioBufferSourceNode) {
    audioBufferSourceNode.loop = false;
    audioBufferSourceNode.start();
    console.log(audioBufferSourceNode.buffer.duration);
  }
}