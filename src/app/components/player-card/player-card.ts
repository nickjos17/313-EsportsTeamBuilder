import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.html',
  styleUrl: './player-card.css'
})
export class PlayerCard {
  @Input() player!: Player; 

  // Optional: Add a function for the "View Profile" button
  viewProfile() {
    console.log('Viewing details for:', this.player.name);
  }
}