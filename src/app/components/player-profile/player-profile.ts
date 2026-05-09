import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster';
import { PlayerCard } from '../player-card/player-card';
import { Player } from '../../models/player.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';
import html2canvas from 'html2canvas';


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
  userRole: string = 'player'; // Default to guest
  showAddForm = false;
  newPlayer: any = {
  name: '',
  role: 'DPS',
  imageUrl: 'assets/icons/Lucio.webp', // Default icon
  stats: {
    winRate: 0,
    kda: 0,
    matchesPlayed: 0
  }
  }
async saveNewPlayer() {
  if (!this.newPlayer.name) {
    alert("Please enter a hero name!");
    return;
  }
  
  try {
    // 1. Call the service to save to Firestore
    await this.rosterService.addPlayer(this.newPlayer);
    
    // 2. Reset and close the form
    this.showAddForm = false;
    this.newPlayer = { name: '', role: 'DPS', imageUrl: 'assets/icons/Lucio.webp', stats: { winRate: 0, kda: 0, matchesPlayed: 0 }};
    alert("Hero added successfully!");
  } catch (error) {
    console.error("Error adding hero:", error);
  }
}
  
  
  @ViewChild('rosterExportArea') rosterArea!: ElementRef;
  async exportAsImage() {
    if (this.teamCount === 0) return;

    // Capture the div and convert it to a canvas
    const canvas = await html2canvas(this.rosterArea.nativeElement, {
      backgroundColor: '#0f1214',
      scale: 2
    });
    
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `MyEsportsTeam-${new Date().getTime()}.png`;
    link.click();
  }
  
  constructor(
  private rosterService: RosterService,
  private db: Database,
  private auth: AuthService
) {}

  ngOnInit() {
  // 1. Load players immediately (independent of auth)
  this.rosterService.getPlayers().subscribe((data) => {
    this.allPlayers = data;
    this.filteredPlayers = data;
    console.log("Players loaded:", data);
  });

  // 2. Check Auth/Role separately
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
  async saveCurrentRoster() {
  if (this.teamCount < 5) {
    alert('Please fill all 5 slots before saving!');
    return;
  }

  // 1. Get the current team from the roster service
  const players = this.rosterService.getTeam();
  
  // 2. We'll give it a generic name for now
  const teamName = "New Roster"; 

  try {
    // 3. Save it to Firebase
    // For now, we use a placeholder ID until your Login is 100% finished
    const userId = "guest_user"; 
    
    await this.db.saveRoster(userId, teamName, players);
    alert('Roster successfully saved to the database!');
  } catch (error) {
    console.error("Error saving roster:", error);
    alert('Failed to save roster. Check console for details.');
  }
}
   drop(event: CdkDragDrop<any>, targetIndex: number) {
  if (targetIndex !== -1) {
    const player = event.item.data;
    this.rosterService.updateSlot(targetIndex, player);
  }
  }
}