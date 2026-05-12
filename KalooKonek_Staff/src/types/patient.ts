export interface RecentPatient {
  id: string;
  time: string;
  name: string;
  purpose: string;
  status: 'COMPLETED' | 'PENDING';
}