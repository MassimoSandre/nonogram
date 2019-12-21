let dim=5;        // rappresenta la dimensione della tabella di gioco per la partita attuale (il valore di inizializzazione è quello default)
let dimmax = 20;  // rappresenta la dimensione della tabella di gioco massima che il programma di prepara a gestire
let k;			  // matrice su cui vengono eseguite le operazioni
let colonne;      // matrice delle sequenze delle colonne
let righe;		  // matrice delle sequenze delle righe

function inizializza()  {
	// Inserisco nell'html il div "areagioco" il cui scopo è contenere la tabella di gioco, il selettore di difficoltà e il bottone "Nuova partita"
    document.getElementById("container").innerHTML = "<div class=\"areagioco\" id=\"areagioco\"></div>";
    // inizializzo la matrice alla massima dimensione supportata
	k = new Array(dimmax);
	// inizializzo la matrice delle sequenze sulle colonne alla massima dimensione supportata
    colonne = new Array(dimmax);
	// inizializzo la matrice delle sequenze sulle righe alla massima dimensione supportata
    righe = new Array(dimmax);
    for(var i = 0; i < dimmax;i++) {
		// continuo l'inizializzazione delle matrici
        k[i] = new Array(dimmax);
        colonne[i] = new Array(dimmax);
        righe[i] = new Array(dimmax);
    }
	// Genero una soluzione al rompicapo inserendo valori pseudo-booleani in modo casuale all'interno della matrice
    for(var i = 0; i < dim; i++) {
        for(var j = 0; j < dim; j++) {
            colonne[i][j] = 0; // inizializzo a 0 la matrice delle sequenze sulle colonne
            righe[i][j] = 0;   // inizializzo a 0 la matrice delle sequenze sulle righe
            k[i][j] = Math.floor(Math.random() * 5); // genero randomicamente un valore tra 0 e 4 compresi
			// se il numero generato è maggiore di 1, allora lo stato della cella di coordinate i j, nella soluzione, avrà stato 1, altrimenti 0
            // quindi la probabilità che ogni cella abbia valore 1 è del 60%
			if(k[i][j] >1) k[i][j] = 1;
            else k[i][j] = 0;
        }
    }
    // calcolo le sequenze sulle righe in funzione della soluzione generata
    for(var i = 0; i < dim;i++) {
        // la variabile j è un indice per scorrere la riga i-esima
		let j = 0;
		// ct è il contatore di sequenze trovate
        let ct = 0;
        righe[i][ct] = 0;
		righe[i][ct+1] = 0;
        while(j < dim) {
			// finché non vengono trovate celle poste a 1, si scorre semplicemente la riga i-esima
            while(k[i][j]==0&&j < dim)j++;
			// quando viene trovato un 1, si scorre finché la sequenza trovata non finisce, e per ogni 1 trovato si incrementa il valore della sequenza ct-esima sulla riga i-esima
            while(k[i][j]==1&&j < dim) {
                j++;
                righe[i][ct]++;
            } 
			// incremento ct (probabilmente, in questo modo, verrà incrementato una volta di troppo al termine dello scorrimento di una riga, ma non è più necessario, quindi è un "problema" irrilevante)
            ct++;
        }
       
    }
    
    // calcolo le sequenze sulle colonne in funzione della soluzione generata
    for(var i = 0; i < dim;i++) {
		// la variabile j è un indice per scorrere la colonna i-esima
        var j = 0;
		// ct è il contatore di sequenze trovate
        let ct = 0;
        colonne[i][ct] = 0;
        colonne[i][ct+1] = 0;
        while(j < dim) {
			// finché non vengono trovate celle poste a 1, si scorre semplicemente la colonna i-esima
            while(j < dim&&k[j][i]==0) j++;
            // quando viene trovato un 1, si scorre finché la sequenza trovata non finisce, e per ogni 1 trovato si incrementa il valore della sequenza ct-esima sulla colonna i-esima
            while(j < dim&&k[j][i]==1) {
                j++;
                colonne[i][ct]++; 
            }
			// incremento ct (probabilmente, in questo modo, verrà incrementato una volta di troppo al termine dello scorrimento di una colonna, ma non è più necessario, quindi è un "problema" irrilevante)
            ct++;
        }
    }
    
	// creo il codice html della tabella
    let str="<br><div class=\"tableset\"><table class=\"table1\" ><tr id='winttitle' class='loser'><td colspan='"+eval(dim+1)+"'>Hai vinto!</td></tr><tr class='loser'></tr><tr><td></td>";
    // creo la prima riga della tabella, contenente gli indizi delle colonne
	// di base ogni cella contenente gli indizi ha come classe "nosat" che significa "not satisfied" indicando che la condizione richiesta dagli indizi, non è verificata nella tabella
	// qualora l'utente dovesse inserire le sequenze in modo che soddisfino le richieste (tale disposizione non coincide per forza con la soluzione finale), la classe verrà cambiata a "sat" che significa "satisfied"
	for(var i = 0; i < dim;i++) {
        str+="<td id='col"+i+"' class=\"nosat\">";
        let j = 0;
		// inserisco in ogni cella gli indizi delle colonne
        while(colonne[i][j]!=0) {
            str+= colonne[i][j++]+"<br>";
        }
        if(j == 0) str+="0<br>";
        str+="</td>";
    }
    str+="</tr>"
	// creo tutte le altre righe della tabella
    for(var i = 0; i < dim;i++) {
		// la prima cella sarà l'indizio della riga i-esima
        str+="<tr><td id='rig"+i+"' nowrap class=\"nosat\">";
        let j = 0;
		// inserisco in ogni prima cella gli indizi della rispettiva riga
        while(righe[i][j]!=0) {
            str+= righe[i][j++]+" ";
        }
        if(j == 0) str+="0 ";
        str+="</td>";
		// dalla seconda cella in poi, inserisco un <td> senza contenuto, avente un id univoco creto tramite le coordinate
		// ogni <td> conterrà 2 dati, data-x e data-y che rappresentano, rispettivamente, la colonna e la riga dove la cella si trova
        // di base ogni <td> ha la classe "off" che identifica lo stato 0, quando viene cliccata viene attivata la funzione changestate(id)
		// questa inverte lo stato della cella cliccata ("off" diventa "on" e viceversa), aggiorna righe e colonne in base al cambiamente e
		// verifica se la partita è stata vinta o no
		for(j = 0; j < dim; j++) {
            str += "<td data-x=\""+j+"\" data-y=\""+i+"\" href=\"#\" id=\"idx"+j+"y"+i+"\" onclick=\"changestate('idx"+j+"y"+i+"') \"class=\"off\"></td>";
        }
        str+="</tr>";
    }
	// la matrice in cui è stata generata la soluzione viene resettata in modo che diventi la matrice dove vengono processati gli input
    for(var i = 0; i < dim;i++) {
        for(var j = 0; j < dim;j++) {
            k[i][j] = 0;
        }
    }
    str+="</table></div>";
	
	// creo la stringa contenente tutto il resto che va inserito nel div "areagioco", ovvero il selettore della difficoltà e il bottone "Nuova partita"
    let str3= "<select id='dimen' class='seldim'>";
    // creo un select che, automaticamente, faccia scegliere la difficoltà tra 2 e la dimensione massima supportata
	for(var i = 2; i <= dimmax;i++) {
		// (dim == i? "selected":"") serve per fare in modo che, quando si clicca sul pulsante nuova partita, il testo all'interno
		// del select corrisponda a quello selezionato per la nuova partita. Ad esempio, se l'utente seleziona come difficoltà "3x3",
		// dopo aver cliccato su "Nuova partita" all'interno del select, di default ci sarà "3x3"
        str3+="<option "+(dim == i? "selected":"")+" value='"+i+"'>"+i+"x"+i+"</option>";
    }
    
    str3+="</select>";

	// inserisco il bottone "Nuova partita" che, una volta premuto, chiama la funzione "changeDim()"
	// questa funzione cambia la difficoltà default (la variabile globale dim) in base alla selezione della difficoltà
	// e richiama la funzione "inizializza()", facendo, quindi, generare una nuova soluzione e il conseguente nuovo set di indizi
    str3+="<input class='seldim' type='button' onclick='changeDim()' value='Nuova partita'>";
    
	// inserisco nel div "areagioco" le due stringhe appena create
	// ho usato getElementsByClassName, al posto di getElementById, perché quest'ultimo non riusciva a selezionarmi il div
    document.getElementsByClassName("areagioco")[0].innerHTML = str3;
    document.getElementsByClassName("areagioco")[0].innerHTML += str;
    
	// creo il div "istrudiv" che contiene un semplice testo: le istruzioni per giocare
    str = "<div class='istrudiv'><h1 class='istruzioni'>Istruzioni</h1><p class='regole'>";
    str += "Ogni cella di questa griglia deve essere colorata o lasciata in bianco in base ai numeri a lato della griglia. Il numero indica quante celle consecutive devono essere riempite, o in riga, o in colonna. Per esempio, un indizio del tipo \"4 8 3\" significa che c'e' un insieme di quattro, otto e tre quadrati da riempire in questo ordine, con almeno quattro bianco tra gruppi successivi.</div>";
	// inserisco il div "istrudiv" in fondo al div "container"
    document.getElementById("container").innerHTML += str;
   
	// eseguo un ciclo di aggiornamento di tutte le righe e tutte le colonne, questo perché, se su una riga, o su una colonna non dovessero esserci celle "attive",
	// quindi l'indizio è 0, questa condizione deve risultare soddisfatta fin dall'inizio.
    for(var i = 0; i < dim;i++){
        aggiornaRiga(i);
        aggiornaColonna(i);
    }
}

function changestate(str) {
	// la funzione changestate viene chiamata ogni volta che l'utente clicca su una cella della tabella.
	// la funzione ha come parametro una stringa, l'id della cella cliccata.
    let x;
    var y;
	// controllo lo stato attuale della cella cliccata
    if(document.getElementById(str).getAttribute("class")=="off") {
		// se la cella aveva come stato (classe) "off", allora questa viene portato ad "on"
        document.getElementById(str).setAttribute("class","on");
		// prendo i dati data-x e data-y dalla cella corrispondente
        x = document.getElementById(str).getAttribute("data-x");
        y = document.getElementById(str).getAttribute("data-y");
		// aggiorno la matrice
        k[y][x] = 1;
		// chiamo la funzione "aggiornaColonna()" che controlla se la modifica appena apportata soddisfi o meno la condizione della colonna x-esima.
		// se la condizione dovesse essere soddisfatta, la classe della cella degli indizi della colonna x-esima, verrà portata a "sat" altrimenti a "nosat".
		// alla funzione viene passsata la variabile x, ovvero il numero della colonna da verificare.
        aggiornaColonna(x);
		// chiamo la funzione "aggiornaRiga()" che controlla se la modifica appena apportata soddisfi o meno la condizione della riga y-esima.
		// se la condizione dovesse essere soddisfatta, la classe della cella degli indizi della riga y-esima, verrà portata a "sat" altrimenti a "nosat".
		// alla funzione viene passsata la variabile y, ovvero il numero della riga da verificare.
        aggiornaRiga(y);
    }
    else {
		// se la cella aveva come stato (classe) "on", allora questa viene portato ad "off"
        document.getElementById(str).setAttribute("class","off");
		// prendo i dati data-x e data-y dalla cella corrispondente
        x = document.getElementById(str).getAttribute("data-x");
        y = document.getElementById(str).getAttribute("data-y");
		// aggiorno la matrice
        k[y][x] = 0;
		// chiamo la funzione "aggiornaColonna()" che controlla se la modifica appena apportata soddisfi o meno la condizione della colonna x-esima.
		// se la condizione dovesse essere soddisfatta, la classe della cella degli indizi della colonna x-esima, verrà portata a "sat" altrimenti a "nosat".
		// alla funzione viene passsata la variabile x, ovvero il numero della colonna da verificare.
        aggiornaColonna(x);
		// chiamo la funzione "aggiornaRiga()" che controlla se la modifica appena apportata soddisfi o meno la condizione della riga y-esima.
		// se la condizione dovesse essere soddisfatta, la classe della cella degli indizi della riga y-esima, verrà portata a "sat" altrimenti a "nosat".
		// alla funzione viene passsata la variabile y, ovvero il numero della riga da verificare.
        aggiornaRiga(y);
    }
}

function aggiornaColonna(col) {
	// la funzione aggiornaColonna() si occupa di vericare se le condizioni della colonna col-esima, dove col è passato come parametro, sono rispettate oppure no
    // in base a questo assegnerà alla cella degli indizi della colonna col-esima la classe "sat" o "nosat"
	
	// eseguo le stesse operazioni che ho eseguito durante il calcolo delle sequenze sulle colonne durante la generazione della partita
	// calcolando le sequenza della colonna col-esima.
	// la variabile local_j viene usata per scorrere la colonna col-esima
	var local_j;
	// la variabile local_ct è il contatore di sequenze
    let local_ct = 0;
	// creo il vettore local_colonne in cui inserirò le sequenze
    var local_colonne = new Array(dimmax);
	// inizializzo il vettore local_colonne a 0
    for(local_j = 0; local_j < dim;local_j++) {
        local_colonne[local_j] = 0;
    }
    local_j = 0;
    while(local_j < dim) {
		// finché non vengono trovate celle poste a 1, si scorre semplicemente la colonna
        while(local_j < dim&&k[local_j][col]==0) local_j++;
        // quando viene trovato un 1, si scorre finché la sequenza trovata non finisce, e per ogni 1 trovato si incrementa il valore della sequenza ct-esima sulla colonna 
        while(local_j < dim&&k[local_j][col]==1) {
            local_j++;
            local_colonne[local_ct]++;
        }
        // incremento local_ct (probabilmente, in questo modo, verrà incrementato una volta di troppo al termine dello scorrimento di una colonna, ma non è più necessario, quindi è un "problema" irrilevante)
        local_ct++;
    }
	
	// confronto le sequenze trovate nella colonna con le condizioni della stessa
    ug = true;
    local_j = 0;
    while((colonne[col][local_j] != 0|| local_colonne[local_j] != 0)&&ug) {
        if(local_colonne[local_j] != colonne[col][local_j]) {
            ug = false;
        }
        local_j++;
    }

    
    if(ug) {
		// se le sequenze coincidono con le condizioni, allora la classe della cella degli indizi della colonna viene messa a "sat"
        document.getElementById("col"+col).setAttribute("class","sat");
		// inoltre, se le condizioni sono state soddisfatte esiste la possibilità che il giocatore abbia vinto, quindi si chiama la funzione verificaVittoria()
		// verifica, appunto, se l'utente ha vinto oppure no e nel caso gestisce l'"evento" della vittoria
        verificaVittoria();
    }
    else {
		// se le sequenze non coincidono con le condizioni, allora la classe della cella degli indizi della colonna viene messa a "nosat"
        document.getElementById("col"+col).setAttribute("class","nosat");
    }
}

function aggiornaRiga(rig) {
    // la funzione aggiornaRiga() si occupa di vericare se le condizioni della riga rig-esima, dove rig è passato come parametro, sono rispettate oppure no
    // in base a questo assegnerà alla cella degli indizi della riga rig-esima la classe "sat" o "nosat"
	
	// eseguo le stesse operazioni che ho eseguito durante il calcolo delle sequenze sulle righe durante la generazione della partita
	// calcolando le sequenza della riga rig-esima.
	// la variabile local_j viene usata per scorrere la riga
    let local_j;
	// la variabile local_ct è il contatore di sequenze
    let local_ct = 0;
	// creo il vettore local_righe in cui inserirò le sequenze
    let local_righe = new Array(dimmax);
	// inizializzo il vettore local_colonne a 0
    for(local_j = 0; local_j < dim;local_j++) {
        local_righe[local_j] = 0;
    }
    local_j = 0;
    while(local_j < dim) {
		// finché non vengono trovate celle poste a 1, si scorre semplicemente la riga
        while(k[rig][local_j]==0&&local_j < dim)local_j++;
		// quando viene trovato un 1, si scorre finché la sequenza trovata non finisce, e per ogni 1 trovato si incrementa il valore della sequenza ct-esima sulla riga 
        while(k[rig][local_j]==1&&local_j < dim) {
            local_j++;
            local_righe[local_ct]++;
        } 
		// incremento local_ct (probabilmente, in questo modo, verrà incrementato una volta di troppo al termine dello scorrimento di una riga, ma non è più necessario, quindi è un "problema" irrilevante)
        local_ct++;
    }

	// confronto le sequenze trovate nella riga con le condizioni della stessa
    ug = true;
    local_j = 0;
    while((righe[rig][local_j] != 0 || local_righe[local_j]!=0)&&ug) {
        if(local_righe[local_j] != righe[rig][local_j]) {
            ug = false;
        }
        local_j++;
    }

    
    if(ug) {
		// se le sequenze coincidono con le condizioni, allora la classe della cella degli indizi della riga viene messa a "sat"
        document.getElementById("rig"+rig).setAttribute("class","sat");
        // inoltre, se le condizioni sono state soddisfatte esiste la possibilità che il giocatore abbia vinto, quindi si chiama la funzione verificaVittoria()
		// verifica, appunto, se l'utente ha vinto oppure no e nel caso gestisce l'"evento" della vittoria
		verificaVittoria();
    }
    else {
		// se le sequenze non coincidono con le condizioni, allora la classe della cella degli indizi della riga viene messa a "nosat"
        document.getElementById("rig"+rig).setAttribute("class","nosat");
    }
}

function verificaVittoria() {
	// la funzione verica vittoria controlla se tutte le condizioni di tutte le colonne e tutte le righe sono state soddistaffe oppure no
    let win = true;
    let local_i = 0;
    while(local_i < dim && win) {
		// controlla tutte le righe e le colonne, se ne trova anche solo 1 posta a "nosat", il ciclo viene interrotto e win viene posto a false
        if(document.getElementById("col"+local_i).getAttribute("class") == "nosat" || document.getElementById("rig"+local_i).getAttribute("class") == "nosat") win = false;
        local_i++;
    }

    if(win){
		// se l'utente ha vinto viene resa visibile la prima cella della colonna che contiene la stringa "Hai vinto!"
        document.getElementById("winttitle").setAttribute("class","winner");       
    }
}

function changeDim() {
	// la funzione change dim modifica la dimensione della tabella di gioco e fa ripartire il processo dall'inizio, generando, quindi, una nuova partita
    
	// la dimensione default viene settata in base al valore selezionato nel select
	dim = document.getElementById("dimen").value;

	// viene chiamata la funzione inizializza() che genera una nuova partita della dimensione specificata
    inizializza();
}

function changeTheme() {
	// la funzione changeTheme ha uno scopo puramente grafico e non è utile al resto del programma.
	// la funzine viene chiamata ogni volta che la checkbox di id "switch" subisce un cambiamento di stato.
	
    if(document.getElementById("switch").checked == true) {
		// se la checkbox è "checked" come foglio di stile viene selezionato "white-nonostyle.css"
        document.getElementById("labeltheme").innerHTML="Light Theme";
        document.getElementById("stile").setAttribute("href","white-nonostyle.css");
    }
    else {
		// se la checkbox è "unchecked" come foglio di stile viene selezionato "black-nonostyle.css"
        document.getElementById("stile").setAttribute("href","black-nonostyle.css");
        document.getElementById("labeltheme").innerHTML="Dark Theme";
    }
}