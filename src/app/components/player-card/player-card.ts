import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';
import { RosterService } from '../../services/roster';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.html',
  styleUrl: './player-card.css'
})
export class PlayerCard {
  @Input() player!: Player;
  @Output() viewProfile = new EventEmitter<Player>();
  selectedProfilePlayer: Player | null = null;
  isEditing = false;
  
  constructor(private rosterService: RosterService) {}

  onAddClick() {
  const team = this.rosterService.getTeam();
  const firstEmptyIndex = team.findIndex(slot => slot === null);
  
  if (firstEmptyIndex !== -1) {
    this.rosterService.updateSlot(firstEmptyIndex, this.player);
  } else {
    alert('Team is full!');
  }
}
onViewProfile() {
  this.viewProfile.emit(this.player);
}
}