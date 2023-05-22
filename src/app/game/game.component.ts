import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore } from '@angular/fire/firestore';
import { collectionData, collection } from '@angular/fire/firestore';
import { addDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';

  game: Game;

  ngOnInit(): void {
    this.newGame();
    const itemCollection = collection(this.firestore, 'games');
    collectionData(itemCollection).subscribe((game) => {
      console.log('Game updated', game);
    });
  }

  constructor(private firestore: Firestore, public dialog: MatDialog) {}


  newGame() {
    this.game = new Game();
    const itemCollection = collection(this.firestore, 'games');
    addDoc(itemCollection, this.game.toJSON());
  }

  takeCard() {
    if (this.game.players.length < 2) {
      this.openDialog();
    } else if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0){
        this.game.players.push(name);
      }
    });
  }
}
