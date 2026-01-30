export const formatTime = (h: number, m: number, s: number): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
