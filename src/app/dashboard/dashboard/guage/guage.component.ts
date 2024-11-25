import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-guage',
  templateUrl: './guage.component.html',
  styleUrls: ['./guage.component.scss']
})
export class GuageComponent {
  @Input() progress: number = 0;
  @Input() halfProgress: number = 0;
  @Input() guageType = 'circular';
  arcPath: string = '';

  ngOnChanges() {
    this.updateArcPath();
  }

  updateArcPath(): void {
    const startX = 10;
    const startY = 50;
    const endX = 90;
    const endY = 50;

    // Normalize the value to fit between 0 and 180 degrees (half-circle)
    const angle = (this.halfProgress / 100) * 180;

    // Calculate the position of the end of the arc
    const radians = (angle * Math.PI) / 180;
    const largeArcFlag = angle > 180 ? 1 : 0;
    const arcX = 50 + 40 * Math.cos(Math.PI - radians);
    const arcY = 50 - 40 * Math.sin(Math.PI - radians);

    // Create the SVG path using the arc parameters
    this.arcPath = `M${startX},${startY} A40,40 0 ${largeArcFlag},1 ${arcX},${arcY}`;
  }
}
