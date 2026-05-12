import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster';
import { PlayerCard } from '../player-card/player-card';
import { Player } from '../../models/player.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';
import html2canvas from 'html2canvas';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule, PlayerCard, FormsModule, DragDropModule],
  templateUrl: './player-profile.html',
  styleUrl: './player-profile.css'
})
export class PlayerProfile implements OnInit {
  // Properties
  allPlayers: Player[] = [];
  filteredPlayers: Player[] = [];
  selectedProfilePlayer: any = null;
  isEditing = false;
  searchTerm: string = '';
  currentTeamName: string = '';
  userRole: string = 'player';
  showAddForm = false;
  
  newPlayer: any = {
    name: '',
    role: 'DPS',
    imageUrl: 'assets/icons/Lucio.webp',
    stats: {
      winRate: 0,
      kda: 0,
      matchesPlayed: 0
    }
  };

  @ViewChild('rosterExportArea') rosterArea!: ElementRef;

  constructor(
    private rosterService: RosterService,
    private db: Database,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.refreshPlayers();

    this.auth.user$.subscribe(async (user: any) => {
      if (user) {
        try {
          this.userRole = await this.auth.getUserRole(user.uid);
        } catch (err) {
          console.error("Auth check failed", err);
          this.userRole = 'player';
        }
      }
    });
  }

  private refreshPlayers() {
    this.rosterService.getPlayers().subscribe((data) => {
      this.allPlayers = data;
      this.filteredPlayers = data;
    });
  }

  openPlayerProfile(player: any) {
    this.selectedProfilePlayer = JSON.parse(JSON.stringify(player));
    this.isEditing = false;
  }

  closeProfile() {
    this.selectedProfilePlayer = null;
    this.isEditing = false;
  }

  async updatePlayerData() {
    if (!this.selectedProfilePlayer?.id) return;
    try {
      await this.db.updateHero(this.selectedProfilePlayer.id, this.selectedProfilePlayer);
      this.isEditing = false;
      this.refreshPlayers();
      this.selectedProfilePlayer = null;
      alert('Hero updated successfully!');
    } catch (e) {
      alert('Update failed');
    }
  }

  async deletePlayerFromDB() {
    if (!this.selectedProfilePlayer?.id) return;
    if (confirm('Permanently delete this hero from the database?')) {
      try {
        await this.db.deleteHero(this.selectedProfilePlayer.id);
        this.refreshPlayers();
        this.selectedProfilePlayer = null;
        alert('Hero deleted.');
      } catch (e) {
        alert('Delete failed');
      }
    }
  }

  //  Roster Logic 
  async saveNewPlayer() {
    if (!this.newPlayer.name) {
      alert("Please enter a Player name!");
      return;
    }
    try {
      this.newPlayer.stats.kda = Number(this.newPlayer.stats.kda);
      this.newPlayer.stats.winRate = Number(this.newPlayer.stats.winRate);
      this.newPlayer.stats.matchesPlayed = Number(this.newPlayer.stats.matchesPlayed);
      await this.rosterService.addPlayer(this.newPlayer);
      
      this.showAddForm = false;
      this.newPlayer = { name: '', role: 'DPS', imageUrl: 'assets/icons/Lucio.webp', stats: { winRate: 0, kda: 0, matchesPlayed: 0 }};
      alert("Player added successfully!");
    } catch (error) {
      console.error("Error adding hero:", error);
    }
  }

  async saveCurrentRoster() {
  if (!this.currentTeamName || !this.currentTeamName.trim()) {
    return;
  }

  if (this.teamCount < 5) {
    alert('Please fill all 5 slots before saving!');
    return;
  }

  this.auth.user$.pipe(take(1)).subscribe(async (user) => {
    if (user) {
      try {
        const players = this.rosterService.getTeam();
        await this.db.saveRoster(user.uid, this.currentTeamName, players);
        
        alert('Roster successfully saved to the database!');
        this.currentTeamName = ''; 
      } catch (error) {
        console.error("Error saving roster:", error);
        alert('Failed to save roster.');
      }
    }
  });
}

  async exportAsImage() {
    if (this.teamCount === 0) return;
    const canvas = await html2canvas(this.rosterArea.nativeElement, {
      backgroundColor: '#0f1214',
      scale: 2
    });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `Roster-${new Date().getTime()}.png`;
    link.click();
  }

  drop(event: CdkDragDrop<any>, index: number) {
    const player = event.item.data;
    this.rosterService.updateSlot(index, player);
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
  remove(index: number) {
  this.rosterService.removeFromSlot(index);
}

  get selectedPlayers() { return this.rosterService.getTeam(); }
  get teamCount(): number { return this.selectedPlayers.filter(p => p !== null).length; }
}
  
