export interface RSVP {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  attending: boolean;
  assignment: 'Tiki' | 'Vampire' | null;
  message: string | null;
}