import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { setDoc } from '@angular/fire/firestore';

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
      const docRef = doc(this.firestore, 'games', this.gameid);

      const unsub = onSnapshot(
        docRef,
        (docData) => {
          if (docData.exists()) {
            this.game = docData.data() as Game;
            console.log('Game data: ', docData.data());
          }
        },
        (error) => {
          console.log('Error getting document:', error);
        }
      );
    });
  }

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
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

  async saveGame() {
    const gameDoc = doc(this.firestore, 'games', this.gameid);
    const gameData = {
      stack: this.game.stack,
      players: this.game.players,
      playedCard: this.game.playedCard,
      currentPlayer: this.game.currentPlayer,
      pickCardAnimation: this.game.pickCardAnimation,
      currentCard: this.game.currentCard,
    };
    try {
      await setDoc(gameDoc, gameData);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
}
