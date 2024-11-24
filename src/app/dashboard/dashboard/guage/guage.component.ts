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

  ngOnChanges() {
    // Ensure progress is within bounds (0 to 100)
    if (this.halfProgress < 0) {
      this.halfProgress = 0;
    } else if (this.halfProgress > 100) {
      this.halfProgress = 100;
    }
  }

  getProgressPath(): string {
    const angle = (this.halfProgress / 100) * 180; // Convert progress to an angle (0 to 180 degrees)
    const radius = 50;  // Radius of the half-moon
    const startX = 50;
    const startY = 50;

    // Calculate the end point of the arc
    const endX = startX + radius * Math.cos((Math.PI - Math.PI * angle / 180));
    const endY = startY - radius * Math.sin((Math.PI - Math.PI * angle / 180));

    return `M 0 50 A 50 50 0 0 1 ${endX} ${endY}`;
  }
}
