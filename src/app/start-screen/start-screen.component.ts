import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  constructor(private router: Router) {
  }
  newGame() {
    console.log('newGame function is called');
    let game = new Game();
    let gameId = 'testGameId'; // statische Spiel-ID für Testzwecke
    this.router.navigate(['/game', gameId]).then(success => console.log('Navigation success:', success))
        .catch(err => console.log('Navigation error:', err));
}

}
