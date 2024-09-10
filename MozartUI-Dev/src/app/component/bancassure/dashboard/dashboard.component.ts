import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // @ViewChild('productCategoryChart', { static: true }) productCategoryChart!: ElementRef;
  // private Highcharts: any;
  // constructor() { }


  // ngAfterViewInit(): void {
  //   console.log('DashboardComponent ngAfterViewInit');
  //   this.createProductCategoryChart();
  //   this.createProductCategoryListChart();
  //   this.createPolicyChart();
  // }


  // createProductCategoryChart() {
  //   this.Highcharts.chart(this.productCategoryChart.nativeElement, {
  //     colors: ['#69CF86', '#1491AC'],
  //     chart: {
  //       type: 'pie'
  //     },
  //     title: {
  //       text: ''
  //     },
  //     tooltip: {
  //       valueSuffix: ''
  //     },
  //     plotOptions: {
  //       pie: {
  //         allowPointSelect: true,
  //         cursor: 'pointer',
  //         dataLabels: {
  //           enabled: true,
  //           format: '{point.name}: {point.percentage:.1f}%'
  //         },
  //         showInLegend: false
  //       }
  //     },
  //     series: [
  //       {
  //         name: 'Count',
  //         colorByPoint: true,
  //         data: [
  //           {
  //             name: 'Health',
  //             y: 356
  //           },
  //           {
  //             name: 'Motor',
  //             y: 564
  //           }
  //         ]
  //       }
  //     ]
  //   });
  // }

  // createProductCategoryListChart() {
  //   this.Highcharts.chart('productcategorylist', {
  //     colors: ['#1491AC', '#31A9C2', '#81D6E8', '#022F38', '#095D70'],
  //     chart: {
  //       type: 'pie'
  //     },
  //     accessibility: {
  //       point: {
  //         valueSuffix: '%'
  //       }
  //     },
  //     title: {
  //       text: ''
  //     },
  //     subtitle: {
  //       text: ''
  //     },
  //     tooltip: {
  //       //pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
  //     },
  //     plotOptions: {
  //       pie: {
  //         allowPointSelect: true,
  //         cursor: 'pointer',
  //         dataLabels: {
  //           enabled: true,
  //           format: '{point.name}: {y} '
  //         },
  //         showInLegend: false
  //       }
  //     },
  //     series: [{
  //       name: 'Count',
  //       colorByPoint: true,
  //       innerSize: '45%',
  //       data: [{
  //         name: 'Two Wheeler',
  //         count: '134',
  //         y: 134
  //       }, {
  //         name: 'PCV',
  //         y: 101
  //       }, {
  //         name: 'Private Car',
  //         y: 156
  //       }, {
  //         name: 'GCV',
  //         y: 110
  //       }, {
  //         name: 'Misc',
  //         y: 98
  //       }]
  //     }]
  //   });
  // }

  // createPolicyChart() {
  //   this.Highcharts.chart('policychart', {
  //     colors: ['#B50536', '#3F97FD'],
  //     chart: {
  //       type: 'spline'
  //     },
  //     title: {
  //       text: ''
  //     },
  //     subtitle: {
  //       text: ''
  //     },
  //     xAxis: {
  //       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  //         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //       accessibility: {
  //         description: 'Months of the year'
  //       }
  //     },
  //     yAxis: {
  //       title: {
  //         text: ''
  //       },
  //       labels: {
  //         //format: '{value}°'
  //         format: '{value} K'
  //       }
  //     },
  //     tooltip: {
  //       crosshairs: true,
  //       shared: true
  //     },
  //     plotOptions: {
  //       spline: {
  //         marker: {
  //           radius: 4,
  //           lineColor: '#666666',
  //           lineWidth: 0
  //         }
  //       }
  //     },
  //     series: [{
  //       name: 'Renewed',
  //       marker: {
  //         symbol: 'circle'
  //       },
  //       data: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6]

  //     }, {
  //       name: 'Pending',
  //       marker: {
  //         symbol: 'circle'
  //       },
  //       data: [1.5, 1.6, 3.3, 5.9, 10.5, 13.5, 14.5, 14.4, 11.5, 8.7, 4.7, 2.6]
  //     }]
  //   });
  // }
}
