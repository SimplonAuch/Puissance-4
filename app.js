

/*
	A list of columns. The column '0' is the left one.
	The first element of a column is the bottom one.
*/
var grid = [
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0]
];





/*
	Who is it to play ?
	(layer 1 or player 2)
*/
var player = 1; 




/*
	If set to true, somme other stuff will be displayed
*/
var debug = true;




function generateGrid( id, grid ){
	var column;

	$(id).html('');
	
	for( var cell=grid[0].length ; cell>=0 ; cell-- ){

		column = $('<tr>').appendTo(id);

		for( var col=0 ; col<grid.length ; col++ ){

			switch( grid[col][cell] ){
				case false: column.append('<td class="grey"></td>'); break;
				case 0: column.append('<td></td>'); break;
				case 1: column.append('<td class="red"></td>'); break;
				case 2: column.append('<td class="yellow"></td>'); break;
			}
		}
	}
}




/*
	 When a player click on a button to add a token
*/
function play(){
	var col = $(this).attr('class');
	var hasPlayed = false;

	for( var cell=0 ; cell<7 ; cell++ ){
		if( grid[col][cell] == 0 ){
			grid[col][cell] = player;
			hasPlayed = true;
			player = player==1 ? 2 : 1;
			break;
		}
	}

	if( ! hasPlayed ){
		alert('Cette colonne est déjà pleine !');
	}

	generateGrid( '#grille', grid );
	findAWinner();
}




function findAWinner(){
	verticalSolution( grid );
	horizontalSolution( grid );
	obliqueTopLeftSolution( grid );
	obliqueTopRightSolution( grid );
}



function verticalSolution( grid ){
	var prevColor;
	var color;
	var serie = 1;

	for( var col=0 ; col<7 ; col++ ){
		prevColor = grid[col][0];

		for( var cell=6 ; cell>0 ; cell-- ){
			color = grid[col][cell];

			if( color == prevColor && color != 0 )
				serie++;
			else
				serie = 1;

			if( serie >=3 ){
				alert('Le joueur ' + (color==1?'rouge':'jaune') + ' a gagné !');
				reset();
			}
			prevColor = color;
		}
	}
}



function horizontalSolution( grid ){
	var prevColor;
	var color;
	var serie = 1;

	for( var cell=0 ; cell<6 ; cell++ ){
		prevColor = grid[0][cell];

		for( var col=1 ; col<7 ; col++ ){
			color = grid[col][cell];

			if( color == prevColor && color != 0 )
				serie++;
			else
				serie = 1;

			if( serie > 3 ){
				alert('Le joueur ' + (color==1?'rouge':'jaune') + ' a gagné !');
				reset();
			}
			prevColor = color;
		}
	}
}





/*
	On décale chaque colonne de 1 vers bas de manière à aligner les
	solutions obliques qui pointent ver le haut à gauche, puis on
	effectue un test horizontal sur le nouveau tableau généré.

*/
function obliqueTopLeftSolution( grid ){
	var gridTest = JSON.parse(JSON.stringify(grid));	// deep copy
	var column;

	for( var col=0 ; col<7 ; col++ ){
		column = gridTest[col];

		for( var i=col ; i>0 ; i--) column.unshift(false);	// add values before
		for( var i=6-col ; i>0 ; i--) column.push(false);	// add values after
	}

	if( debug ){
		generateGrid( '#test1', gridTest );
	}

	horizontalSolution( gridTest );
}





/*
	On décale chaque colonne de 1 vers bas de manière à aligner les
	solutions obliques qui pointent ver le haut à droite, puis on
	effectue un test horizontal sur le nouveau tableau généré.

*/
function obliqueTopRightSolution( grid ){
	var column;
	var gridTest = JSON.parse(JSON.stringify(grid));	// deep copy

	for( var col=0 ; col<7 ; col++ ){
		column = gridTest[col];

		for( var i=6-col ; i>0 ; i--) column.unshift(false);	// add values before
		for( var i=col ; i>0 ; i--) column.push(false);	// add values after
	}

	if( debug ){
		generateGrid( '#test2', gridTest );
	}

	horizontalSolution( gridTest );
}




function reset(){
	window.location.reload();
}





$(document).ready(function(){

	generateGrid( '#grille', grid );

	$('table button').on('click', play);
	$('.reset').on('click', reset);

});



