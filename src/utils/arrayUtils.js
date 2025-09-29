/**
 * Durstenfeld shuffle implementation used to randomise the playback queue
 * while keeping the original playlist untouched.
 */
export function shuffleInPlace(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
}
