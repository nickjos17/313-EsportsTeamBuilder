import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster';
import { PlayerCard } from '../player-card/player-card';
import { Player } from '../../models/player.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule, PlayerCard, FormsModule, DragDropModule],
  templateUrl: './player-profile.html',
  styleUrl: './player-profile.css'
})
export class PlayerProfile implements OnInit {
  allPlayers: Player[] = [];
  filteredPlayers: Player[] = [];
  searchTerm: string = '';
  
  constructor(private rosterService: RosterService) {}

  ngOnInit(): void {
    this.allPlayers = this.rosterService.getPlayers();
    this.filteredPlayers = this.allPlayers;
  }
  remove(index: number) {
  this.rosterService.removeFromSlot(index);
}
  get selectedPlayers() {
    return this.rosterService.getTeam();
  }
  get teamCount(): number {
    return this.selectedPlayers.filter(p => p !== null).length;
  }
  filterPlayers(): void {
    this.filteredPlayers = this.allPlayers.filter(p => 
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  clearRoster(): void {
    this.rosterService.clearAllSlots();
  }
   drop(event: CdkDragDrop<any>, targetIndex: number) {
  if (targetIndex !== -1) {
    const player = event.item.data;
    this.rosterService.updateSlot(targetIndex, player);
  }
  }
}