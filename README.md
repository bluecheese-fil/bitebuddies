# BiteBuddies
Progetto per l'esame "Linguaggi e tecnologie per il web"

## Componenti necessari per la creazione della registrazione
Bisogna aggiungere una sezione per far fare la registrazione agli utenti ed ai ristoranti.
Per gli utenti abbiamo bisogno:
  - Nome
  - Cognome
  - Un metodo di pagamento
  - Indirizzo (fisico)
  - Indirizzo email e telefono per le info
  - Nome sul citofono
  - Password (restrizioni sulle password?)
  - Aggiunegrei anche un checkbox nella registrazione in stile "email spam"
  - Orario di consegna(Fra)

E' necessario controllare che l'email ed il numero di telefono siano unici (dovrebbe essere assicurato dalla primary key nella tabella)

Per i ristoranti:
  - Nome titolare
  - Cognome titolare
  - Indirizzo fisico
  - Menu
  - Costo Menu(Fra)
  - Costo consegna
  - Numero di telefono ed indirizzo email
  - Password (restrizioni sulle password?)
  - Quanti ordini possono accettare ad "slot orario"

  Vogliamo richiedere ai ristoranti un documento approvato dall'FDA/NAS? In questo caso ci vorrebbe l'approvazione di un operatore per aggiungere il ristorante alla lista di ristoranti abilitati

### Dopo la registrazione:
Per ogni utente bisogna salvare:
  1. Uno storico ordini
  2. I documenti e le informazioni inserite

Per i ristoranti possiamo *NON* inserire lo storico ordini (?)

### Implementazione sicura
Bisogna creare un modo per cui non si possa creare un ordine per lo stesso ristorante che superi il numero di ordini possibili per quel ristorante.
es:
  Se nella fascia oraria 8.15 il ristorante puo' accettare solo 10 ordini, e ne ha gia' presi 9; cosa succede se due utenti fanno un ordine contemporaneamente?

Bisogna salvare le password degli utenti in modo che siano hashed, ed attraverso una qualche forma di sale. Nel caso ci sia una breccia *NON* vogliamo che le password siano salvate in chiaro, e *NON* vogliamo che le stesse password siano visibili all'interno del database. Potremmo salvare le password in questo modo:

**`user:salt:hashedpassword`**

Bisogna quindi generate un sale causale ed utilizzare un algoritmo (meglio se noto) di hashing per la password
Io userei SHA-256 al posto di md5. Md5 ha ormai una certa eta' ed e' un po' datato.

Invece di salvare l'utente in chiaro (tramite email) potremmo usare una qualche forma di identificativo per evitare che si abbiano gli indirizzi email in modo relativamente veloce. Potremmo, per esempio, ad ogni utente un identificativo unico da usare all'interno del database. Potremmo quindi usare questo identificativo salvato all'interno delle informazioni dell'utente in chiaro, in modo da collegare una certa email ad una password. Questo puo' essere utile se dovessero rubare solo uno dei database. Si ritroverebbero con poca roba in mano.

### Assicurare privacy agli utenti
Sarebbe ideale evitare che l'indirizzo fisco ed altre informazioni venissero scritte in chiaro da qualche parte. Vogliamo quindi criptare (simmetricamente) queste informazioni, e mandarle decriptate all'utente solo se si riescono ad autenticare. Se imponiamo delle condizioni decenti per le password potremmo utilizzare un seed per creare una chiave AES256, dove il seed e' definito come:
 
 **email + password + numero di telefono**

Altre informazioni sulla generazione di una chiave AES256: <br>
https://stackoverflow.com/questions/861679/generate-aes-key-with-seed-value

Potrebbe risultare particolarmente comodo dato che, per quanto la password potrebbe essere uguale (ma in modo molto improbabile con le giuste restrizioni), email e numero di telefono devono obbligatoriamente essere diversi!

### Eliminazione degli utenti
Bisogna creare una qualche forma di pagina web per richiedere l'eliminazione all'interno del database dell'utente. In particolare va rimossa la password, e tutte le varie informazioni

## Dinamizzazione del sito
Il sito deve essere vagamente dinamico. Bisogna fare una buona ricerca per trovare delle immagini da scaricare ed usare, e bisogna usare oppurtunamente i CSS per fare un minimo di animazioni decenti!. Poi vediamo come farlo
Si può pensare di fare un sito che scorre verso il basso(Fra)

## Possibile organizzazione delle tabelle

Utente: <br>
  * email :arrow_right: primary key
  * codice :arrow_right: unique

ChiaveAES:
  * email :arrow_right: primary key
  * chiave AES

**Attenzione! La tabella ChiaveAES deve avere i permessi in modo che NESSUNO puo' accedervi se non il server stesso!**
Quando mandiamo le informazioni all'utente possiamo farlo in plain-text, tanto ci pensa https a renderle sicure. Bisogna quindi fare in modo che solo il server ottenga una singola volta la chiave per ottentere i dati all'interno della tabella "Informazioni utente".
Bisogna inoltre controllare che non ci siano richieste di tutte le chiavi! Nel caso disgraziato in cui qualcuno riesca a falsificare il prorpio stato e sembrare il server, non deve comunque essere in grado di richiedere tutta la tabella con una singola query!. Le uniche query accettabili sono quelle dove viene speicifcato il codice, e quindi restituiscono una singola chiave AES alla volta. Per rallentare ulteriormente l'attaccante bisognerebbe applicare la stessa policy alla tabella "Utente". Le uniche query accettabili sono quelle dove si specifica una particolare mail, e dove viene quindi restituito il codice. In questo modo, l'attaccante non puo' ottenere tutte le mail allo stesso momento e non puo' ottenere tutti i codici allo stesso momento. Questo fa si che le chiavi AES sono sicure fino a che l'attaccante non provi ad indovinare email a caso, o non prova email a caso.
Ho inoltre inserito *email* come chiave primaria di ChiaveAES, in quanto i codici potrebbero essere meno sicuro o seguire una qualche forma di pattern che l'attaccante potrebbe sfruttare andando a provare diversi codici. Mettendo una email, richiediamo uno step ulteriore nella trasformazione da email a codice per ottenere le informazioni all'interno della tabella "Informazioni utente"

Informazioni utente:
  + codice :arrow_right: primary key
  + :arrow_right: Tutte le informazioni seguenti devono essere criptate con l'agoritmo AES-256
  + indirizzo
  + telefono
  + carta di credito
  + ....

Password:
  - codice :arrow_right: primary key
  - hashed password *Questo serve per controllare che l'utente sia effettivamente lui*

Le tabelle per i ristoranti dovrebbero essere relativamente simili. L'unica differenza starebbe nella creazione di una nuova tabella "Informazioni ristorante", che e' diversa da informazioni utente. Potremmo usare dei codici generati con delle differenze in modo riconoscere se si tratta di un utente "comprante" o di un ristorante; per esempio:

### Codici per le tabelle

Ristorante:
  * r_cod0-1
  * r_cod0-2
  * ...
  * r_cod0-20

L'elemento che cambia e' il numero 1. Potremmo farlo:
  - casuale
  - con una forma di incremento

Potremmo applicare regole matematiche ulteriormente restrittive (per esempio  il codice deve essere divisibile per 3 o per 7, o entrambi). Il numero prima del trattino conta le centinaia (e quindi per il numero 2'347, duemilatrecentoquarantasette risulta: r_cod23-47)

Utenti:
  - u_cod0-1
 
Dove valgono le stesse ipotesi per i numeri scritte qui sopra.

In questo modo, data la prima lettera del codice, sappiamo in quale tabella dobbiamo guardare

# Database
Il database si trova all'interno della nuova cartella "database"

Per accedervi:
- utente      bitebuddies
- password  bites1!


## Definizioni delle tabelle:
Utenti:
  - user_id :arrow_right: primarykey
  - email :arrow_right: unqiue not null
  - Passwd :arrow_right: not null

Persone:
  - user_id :arrow_right: primarykey
  - Nome :arrow_right: not null
  - Cognome :arrow_right: not null

Indirizzi:
  - user_id :arrow_right: not null (fk on user_id in persone)
  - indirizzo :arrow_right: not null

  - (user_id, indirizzo) :arrow_right: primarykey (non si possono inserire piu' indirizzi per la stessa persona)

Telefoni:
  - user_id :arrow_right: not null (fk on user_id in persone)
  - telefono :arrow_right: not null

  - (user_id, telefono) :arrow_right: primarykey (non si possono inserire piu' telefoni per la stessa persona)