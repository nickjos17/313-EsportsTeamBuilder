import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';
import { firstValueFrom } from 'rxjs';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-roster-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roster-view.html',
  styleUrl: './roster-view.css'
})
export class RosterView implements OnInit {
  userRole: string = 'player';
  @ViewChild('rosterExportArea') rosterExportArea!: ElementRef;
  savedTeams: any[] = [];
  selectedTeam: any = null;
  loading = true;

  constructor(private db: Database, private auth: AuthService) {}

  selectTeam(team: any) {
    this.selectedTeam = team;
  }
  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.loadTeams(user.uid);
      }
    });
  }

  async loadTeams(userId: string) {
    this.loading = true;
    try {
      this.savedTeams = await this.db.getSavedRosters(userId);
    } catch (error) {
      console.error("Error loading rosters:", error);
    } finally {
      this.loading = false;
    }
  }

  async deleteRoster(rosterId: string) {
  const user = await firstValueFrom(this.auth.user$);
  if (user && confirm('Are you sure you want to delete this roster?')) {
    await this.db.deleteRoster(user.uid, rosterId);
    this.loadTeams(user.uid);
    this.selectedTeam = null;
  }
}
async exportAsImage() {
    if (!this.selectedTeam) return;

    const element = this.rosterExportArea.nativeElement;
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f1214', 
      scale: 2, 
      logging: false,
      useCORS: true
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${this.selectedTeam.teamName.replace(/\s+/g, '_')}_Roster.png`;
    link.href = dataUrl;
    link.click();
  }
}