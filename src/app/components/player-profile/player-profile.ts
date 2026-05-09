import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule
import { RosterService } from '../../services/roster';
import { PlayerCard } from '../player-card/player-card';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule, PlayerCard, FormsModule], // 2. Add FormsModule here
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
    this.filteredPlayers = this.allPlayers; // Start with everyone visible
  }

  // 3. Filter logic
  filterPlayers(): void {
    this.filteredPlayers = this.allPlayers.filter(p => 
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}