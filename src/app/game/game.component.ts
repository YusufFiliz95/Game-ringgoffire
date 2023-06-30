import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  gameid: string;
  game: Game;

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameid = params['id'];
      // Lesen Sie das Spiel aus dem lokalen Speicher
      let localGame = localStorage.getItem('games-' + this.gameid);
      if (localGame) {
        this.game = JSON.parse(localGame) as Game;
        console.log('Game data: ', this.game);
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.players.length < 2) {
      this.openDialog();
    } else if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCard.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    // Speichern Sie das Spiel im lokalen Speicher
    localStorage.setItem('games-' + this.gameid, JSON.stringify(this.game));
  }
}
