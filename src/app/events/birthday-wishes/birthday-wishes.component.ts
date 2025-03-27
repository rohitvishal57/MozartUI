import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay } from 'date-fns';
import { EventsService } from '../events-new/events.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

interface Birthday {
  name: string;
  date: string;
  customerID: string;
  mobileNumber: string;
}

interface WeekDay {
  date: string;
  day: string;
  birthdays: Birthday[];
}

@Component({
  selector: 'app-birthday-wishes',
  templateUrl: './birthday-wishes.component.html',
  styleUrls: ['./birthday-wishes.component.scss']
})
export class BirthdayWishesComponent implements OnInit {
  currentView: string = 'day';
  startDate: string = '';
  endDate: string = '';
  birthdays: Birthday[] = [];
  // weekData: WeekDay[] = [];
  filteredBirthdays: Birthday[] = [];
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  isSendingWishes: boolean = false;
  isSendingAllWishes: boolean = false;
  selectedDate: Date = new Date(); 
  selectedDayBirthdays: Birthday[] = []; 
  weekData: { date: Date; birthdays: Birthday[] }[] = [];
  todayDate = this.datePipe.transform(new Date().toISOString().split('T')[0], 'dd-MM-yyyy');
  constructor(private http: HttpClient, private eventsService: EventsService, private datePipe : DatePipe, private route: Router) {}

  ngOnInit(): void {
    this.setView(this.currentView);
    
  }

  
  sendWishes(birthday: Birthday): void {
    if (this.isSendingWishes) return;

    this.isSendingWishes = true;
    const sendWishesPayload = {
      customerID: birthday.customerID,
      fullName: birthday.name,
      mobileNumber: birthday.mobileNumber
    };

    this.eventsService.sendIndividualWishes(sendWishesPayload).subscribe({
        next: (response) => {
          console.log('Wishes sent successfully to:', birthday.name);
          this.showSuccessMessage(`Birthday wishes sent to ${birthday.name}`);
        },
        error: (error) => {
          console.error('Error sending wishes:', error);
          this.showErrorMessage(`Failed to send wishes to ${birthday.name}`);
        },
        complete: () => {
          this.isSendingWishes = false;
        }
      });
  }

  sendWishesToAll(): void {
    if (this.isSendingAllWishes) return;
    this.isSendingAllWishes = true;
    const SendWishesAllPayload = this.selectedDayBirthdays.map(birthday => ({
      customerId: birthday.customerID,
      fullName: birthday.name,
      mobileNumber: birthday.mobileNumber
    }));

    this.eventsService.sendWishesToAll(SendWishesAllPayload)
      .subscribe({
        next: (response) => {
          console.log('Wishes sent successfully to all customers');
          this.showSuccessMessage('Birthday wishes sent to all customers');
        },
        error: (error) => {
          console.error('Error sending wishes to all:', error);
          this.showErrorMessage('Failed to send wishes to all customers');
        },
        complete: () => {
          this.isSendingAllWishes = false;
        }
      });
  }
  private showSuccessMessage(message: string): void {
    alert(message);
  }

  private showErrorMessage(message: string): void {
    alert(message);
  }

  setView(view: string): void {
    this.currentView = view;
    this.setDates();
    this.loadBirthdayData();
    if (view === 'day') {
      this.filterDayBirthdays(this.selectedDate);
    }
}

navigateToDayView(date: Date): void {
  this.birthdays = []
    this.selectedDate = date;
    this.setView('day');
}

filterDayBirthdays(date: Date): void {
    const dayData = this.weekData.find((day) => this.isSameDate(day.date, date));
    this.selectedDayBirthdays = dayData ? dayData.birthdays : [];
}


isSameDate(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

  // setView(view: string): void {
  //   this.currentView = view;
  //   this.setDates();
  //   this.loadBirthdayData();
  // }

  
  setDates(): void {
    const today = this.selectedDate;
    const weekDate = new Date()
    switch (this.currentView) {
      case 'day':
        this.startDate = format(today, 'yyyy-MM-dd');
        this.endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'week':
        this.startDate = format(weekDate, 'yyyy-MM-dd');
        const endDate = new Date(weekDate);
        endDate.setDate(weekDate.getDate() + 6);
        this.endDate = format(endDate, 'yyyy-MM-dd');
        break;
      case 'month':
        this.startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        this.endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
    }
  }

  loadBirthdayData(): void {
    const payload = {
      agentCode: localStorage.getItem('agentCode'),
      startDate: this.startDate,
      endDate: this.endDate
    };
  
    this.eventsService.getBirthdays(payload).subscribe({
      next: (response:any) => {
        this.selectedDayBirthdays = response.data.map((item:any) => ({
          name: item.fullName.trim(),
          date: this.transformDateFormat(item.birthday),
          customerID: item.customerID,
          mobileNumber: item.mobileNumber
        }));
      console.log('this.brda', this.birthdays);
          this.filterBirthdays();
          this.loadWeekData();
      },
      error: (error) => {
        console.error('Error loading birthday data', error);
      }
    });
  }
  
  transformDateFormat(dateString: string): string {
    const datePart = dateString.split(' ')[0];
    const [month, day, year] = datePart.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // filterBirthdays(): void {
  //   this.filteredBirthdays = this.selectedDayBirthdays.filter((b) => {
  //     const birthDate = new Date(b.date);
  //     return (
  //       birthDate.getTime() >= new Date(this.startDate).getTime() &&
  //       birthDate.getTime() <= new Date(this.endDate).getTime()
  //     );
  //   });

  //   if (this.currentView === 'week') {
  //     this.loadWeekData();
  //   }
  // }
  filterBirthdays(): void {
    
    // Ensure birthdays are loaded before filtering
    if (!this.selectedDayBirthdays) return;
  
    this.filteredBirthdays = this.selectedDayBirthdays.filter((b) => {
      const birthDate = new Date(b.date);
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
  
      return (
        birthDate.getTime() >= startDate.getTime() &&
        birthDate.getTime() <= endDate.getTime()
      );
    });
  
    console.log('filteredBirthdays', this.filteredBirthdays);
  
    if (this.currentView === 'week') {
      this.loadWeekData();
    }
  }

//   loadWeekData(): void {
//   // Reset week data
//   this.weekData = [];
  
//   const startDate = new Date(this.startDate);
//   const endDate = new Date(this.endDate);

//   for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//     const dayIndex = date.getDay();
//     const day = this.weekDays[dayIndex];
    
//     const birthdaysForDay = this.filteredBirthdays.filter(
//       (b) => new Date(b.date).toDateString() === date.toDateString()
//     );

//     // this.weekData.push({
//     //   date: format(date, 'yyyy-MM-dd'),
//     //   day,
//     //   birthdays: birthdaysForDay
//     // });
//     this.weekData.push({
//       date: currentDateStr,
//       day,
//       birthdays: birthdaysForDay.map(b => ({
//         name: b.name,
//         date: b.date
//       }))
//     });
//     console.log('week', this.weekData);
    
//   }
// }

loadWeekData(): void {
  this.weekData = [];
  let startDate = startOfDay(new Date(this.startDate));
  const endDate = new Date(this.endDate);

  console.log('Loading week data with birthdays:', this.selectedDayBirthdays);

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayIndex = date.getDay();
    const day = this.weekDays[dayIndex];
    const currentDateStr = format(date, 'MM-dd');
    const currentYear = new Date().getFullYear();


    // Find birthdays for the current day
    console.log(this.selectedDayBirthdays, "birthdays")
    const birthdaysForDay = this.selectedDayBirthdays.filter(birthday => {
      const birthdayDate = format(new Date(birthday.date), 'MM-dd');
      return birthdayDate === currentDateStr;
    });
    console.log(birthdaysForDay, "birthdaysforday" )

    // Create week data item with full birthday information
    const weekDataItem: { date: Date; day: string; birthdays: Birthday[] } = {
      date: startOfDay(new Date(`${currentYear}-${currentDateStr}`)),
      day,
      birthdays: birthdaysForDay.map(birthday => ({
          name: birthday.name,
          date: birthday.date,
          customerID: birthday.customerID,
          mobileNumber: birthday.mobileNumber
      }))
     
  };
  this.weekData.push(weekDataItem);
  console.log(`Added week data for ${currentDateStr}:`, weekDataItem);
  console.log('Final week data:', this.weekData);
}

}

  getBirthdaysForDay(day: WeekDay): Birthday[] {
    return this.filteredBirthdays.filter(
      (b) => {
        const birthdayDate = new Date(b.date);
        let dayDate = new Date(day.date);
        return birthdayDate.toDateString() === dayDate.toDateString();
      }
    );
  }

  // loadWeekData(): void {
  //   this.weekData = [];
  //   const startDate = new Date;
  //   const endDate = new Date;

  //   for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
  //     const dayIndex = date.getDay();
  //     const day = this.weekDays[dayIndex];
  //     const birthdaysForDay = this.filteredBirthdays.filter(
  //       (b) => new Date(b.date).toDateString() === date.toDateString()
  //     );

  //     this.weekData.push({
  //       date: format(date, 'yyyy-MM-dd'),
  //       day,
  //       birthdays: birthdaysForDay
  //     });
  //   }
  // }

  getMonthDays(): any[] {
    const currentMonth = new Date().getMonth();
    const monthDays: any[] = [];

    for (let day = 1; day <= 31; day++) {
      const date = new Date(new Date().getFullYear(), currentMonth, day);
      const birthdaysForDay = this.filteredBirthdays.filter(
        (b) => new Date(b.date).toDateString() === date.toDateString()
      );

      if (birthdaysForDay.length > 0) {
        monthDays.push({
          date,
          birthdays: birthdaysForDay
        });
      }
    }

    return monthDays;
  }

  navigateToEvents() {
    this.route.navigate(["events/eventsList"]);
  }
}