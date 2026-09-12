export type Language = 'es' | 'en';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  location: string;
  badge?: string;
  iconName: string;
  highlight?: boolean;
}

export interface DaySchedule {
  dayNumber: '1' | '2';
  dateBadge: string;
  dateKey: 'sept3' | 'sept4';
  dayOfWeek: string;
  fullDateString: string;
  title: string;
  subtitle: string;
  location: string;
  dressCode: {
    title: string;
    description: string;
  };
  shuttleInfo: {
    title: string;
    description: string;
  };
  events: ScheduleItem[];
  calEvent: {
    title: string;
    description: string;
    location: string;
    startTime: string; // ISO or YYYYMMDDTHHmmss
    endTime: string;
  };
}

export interface RegistryItem {
  id: string;
  title: string;
  category: 'honeymoon' | 'experience' | 'home';
  description: string;
  suggestedContribution?: number;
  image: string;
  tag: string;
}

export interface GuestRsvp {
  code?: string;
  fullName: string;
  email: string;
  attendance: 'yes' | 'no';
  attendingDays?: 'both' | 'sept3_only' | 'sept4_only';
  plusOneCount: number;
  plusOneNames?: string;
  dietaryPreference?: 'none' | 'vegetarian' | 'vegan' | 'celiac' | 'other';
  allergiesNote?: string;
  shuttleBooking: boolean;
  shuttlePickupLocation?: string;
  roomBooking?: 'none' | 'estandar' | 'superior' | 'deluxe' | 'suite_guardia' | 'suite_medieval';
  songRequest?: string;
  blessingMessage?: string;
  submittedAt: string;
}

export interface GuestbookWish {
  id: string;
  author: string;
  city?: string;
  message: string;
  timestamp: string;
}

export interface CastlePhoto {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
}
