import type { RoomAvailability } from './rsvp';
// Session memory only. Never derive availability from the local initial inventory.
let snapshot: RoomAvailability[] | undefined;
let revision = 0;
const listeners = new Set<() => void>();
export const roomAvailabilityStore = {
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  getSnapshot() { return snapshot; },
  publish(rooms: RoomAvailability[] | undefined) {
    if (rooms === undefined) return;
    revision++;
    snapshot = rooms;
    listeners.forEach(listener => listener());
  },
  // An earlier catalogue request must not overwrite the inventory returned
  // after a successful save.
  beginRefresh() {
    const requestRevision = ++revision;
    return (rooms: RoomAvailability[] | undefined) => {
      if (!rooms || requestRevision !== revision) return;
      snapshot = rooms;
      listeners.forEach(listener => listener());
    };
  },
};
