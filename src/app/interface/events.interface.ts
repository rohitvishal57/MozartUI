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
  
  export interface ReferenceData {
    proposalNum?: string;
    leadNumber?: string;
    name: string;
    phoneNumber: string;
  }
  
  export interface ApiResponse {
    isSuccess: boolean;
    statusCode: number;
    message: string;
    data: ReferenceData[];
  }

  export enum CalendarView {
    Day = 'day',
    Week = 'week',
    Month = 'month',
  }