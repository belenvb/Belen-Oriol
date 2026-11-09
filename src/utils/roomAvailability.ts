import type { RoomAvailability } from './rsvp';
// Session memory only. Never derive availability from the local initial inventory.
let snapshot: RoomAvailability[] | undefined;
let validated = false;
const listeners = new Set<() => void>();
export const roomAvailabilityStore = {
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  getSnapshot() { return snapshot; },
  publish(rooms: RoomAvailability[] | undefined) {
    if (rooms === undefined) return;
    validated = true;
    snapshot = rooms;
    listeners.forEach(listener => listener());
  },
  // A slower public request must never overwrite the personalized inventory
  // returned when a guest validates their invitation.
  publishPublic(rooms: RoomAvailability[] | undefined) {
    if (!rooms || validated) return;
    snapshot = rooms;
    listeners.forEach(listener => listener());
  },
};
