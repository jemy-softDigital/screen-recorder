export const mixAudioTracks = (
  tracks: MediaStreamTrack[],
): MediaStreamTrack => {
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();

  tracks.forEach((track) => {
    const source = audioContext.createMediaStreamSource(
      new MediaStream([track]),
    );
    source.connect(destination);
  });

  return destination.stream.getAudioTracks()[0];
};
