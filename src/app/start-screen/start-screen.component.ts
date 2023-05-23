import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  constructor(private router: Router,
    private firestore: Firestore) {
  }
  newGame(){
    let game = new Game();
    const gameCollection = collection(this.firestore, 'games');
    addDoc(gameCollection, game.toJSON()).then((gameInfo:any) => {
      this.router.navigate(['/game', gameInfo.id]);
    });
  }
}
