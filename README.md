# BiteBuddies
Progetto per l'esame "Linguaggi e tecnologie per il web"

## Componenti necessari per la creazione della registrazione
Bisogna aggiungere una sezione per far fare la registrazione agli utenti ed ai ristoranti.
Per gli utenti abbiamo bisogno:
  - Nome
  - Cognome
  - Indirizzo email
  - Password (restrizioni sulle password: 2 minuscole, 2 maiuscole, 2 numeri, 2 speciali)
  - Indirizzo fisico e telefono
  - Orario di consegna (Fra)

Per i ristoranti:
  - Nome titolare
  - Cognome titolare
  - Nome ristorante
  - Indirizzo fisico
  - Menu
  - Costo Menu(Fra)
  - Costo consegna
  - Numero di telefono ed indirizzo email
  - Password (restrizioni sulle password?)
  - Quanti ordini possono accettare ad "slot orario"

### Dopo la registrazione:
Per ogni utente bisogna salvare:
  1. Uno storico ordini
  2. I documenti e le informazioni inserite

Per i ristoranti possiamo *NON* inserire lo storico ordini (?)

### Implementazione sicura
La password salvata nel database è hashed, e nei cookie viene salvato un identificativo ed un token generato casualmente. I due vengono criptati con questa chiave, dato che i cookie sono leggibili da tutti
chiave: n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&

### Eliminazione degli utenti
Ogni foreign key ha: ONUPDATE e ONDELETE impostato a CASCADE. Basta cambiare una riga in utenti che tutte le informazioni di quell'utente vengono eliminate. Allo stesso modo, se viene cambiato l'user_id, viene aggiornato automaticamente su tutte le tabelle. E' quiid possibile eliminare facilmente un utente, dato che basta eliminare la sua riga dalla tabella "utenti"

### Indirizzi all'interno del database
Tutte le apostrofi sono state sostituite con &#39, secondo lo standard html. Questo è fatto per evitare errori negli inserimenti all'interno del database, soprattutto per gli indirizzi

## Dinamizzazione del sito
Il sito deve essere vagamente dinamico. Bisogna fare una buona ricerca per trovare delle immagini da scaricare ed usare, e bisogna usare oppurtunamente i CSS per fare un minimo di animazioni decenti!. Poi vediamo come farlo
Si può pensare di fare un sito che scorre verso il basso(Fra)

# Database
Per accedere al database si possono usare questa combinazione di utente e password:
- utente      bitebuddies
- password    bites1!


## Definizioni delle tabelle:
Utenti:
  - user_id bigserial :arrow_right: primarykey
  - email varchar(100):arrow_right: unqiue not null
  - passwd varchar(255) :arrow_right: not null
  - token char(255) :arrow_right: not null

Persone:
  - user_id bigint :arrow_right: primarykey (fk on user_id in utenti)
  - Nome varchar(50) :arrow_right: not null
  - Cognome varchar(50) :arrow_right: not null

Indirizzi:
  - user_id bigint :arrow_right: not null (fk on user_id in persone)
  - indirizzo varchar(200) :arrow_right: not null
  - def_indirizzo boolean :arrow_right: not null (Indica l'indirizzo primario, ci puo' essere solo uno con true)

  - (user_id, indirizzo) :arrow_right: primarykey (non si possono inserire piu' indirizzi per la stessa persona)

Telefoni:
  - user_id bigint :arrow_right: not null (fk on user_id in persone)
  - telefono varchar(15) :arrow_right: not null
  - def_telefono boolean :arrow_right: not null (Indica il telefono primario, ci puo' essere solo uno con true)

  - (user_id, telefono) :arrow_right: primarykey (non si possono inserire piu' telefoni per la stessa persona)

Ordini:
  - order_id bigserial :arrow_right: primarykey
  - user_id bigint :arrow_right: not null (fk on user_id in persone)
  - rest_id bigint :arrow_right: not null (fk on rest_id in ristoranti)
  - data date :arrow_right: not null
  - orario time :arrow_right: not null
  - indirizzo varchar(200) :arrow_right: not null, (fk con user_id in indirizzi)

Contenuto:
  - order_id bigint :arrow_right: not null (fk on Ordini)
  - oggetto varchar(250) :arrow_right: not null
  - qt smallint :arrow_right: not null

Ristoranti:
  - rest_id bigserial :arrow_right: primary key
  - nome varchar(250) :arrow_right: not null
  - immagine char(50) :arrow_right: not null

Menu:
  - rest_id bigint :arrow_right: not null (fk on rest_id in ristoranti)
  - oggetto varchar(50) :arrow_right: not null

Login di account dato di default:
email:  checcoz@zalon.org
passwd: as123!@#ASD