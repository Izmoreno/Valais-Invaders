let scores = [];
//exemple : {id: date, score}


const addScore = (ev)=>{
let playerScore = {
	id: timeWhenGameStarted,
	scorep : score
}

scores.push(playerScore);

//saving in localstorage
localStorage.setItem('HighScoreList', JSON.stringify(scores));
}
