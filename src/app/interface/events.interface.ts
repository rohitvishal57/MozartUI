export interface CalendarEvent {
    id: number;
    note: string;
    title: string;
    start: Date;
    end: Date;
    color?: {
      primary: string;
      secondary: string;
    };
    allDay?: boolean;
  }
  
  export enum CalendarView {
    Day = 'day',
    Week = 'week',
    Month = 'month',
  }