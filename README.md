# BiteBuddies
Progetto per l'esame "Linguaggi e tecnologie per il web"

## Componenti necessari per la creazione della registrazione
Bisogna aggiungere una sezione per far fare la registrazione agli utenti.
Per gli utenti abbiamo bisogno:
  - Nome
  - Cognome
  - Indirizzo email
  - Password (restrizioni sulle password: 2 minuscole, 2 maiuscole, 2 numeri, 2 speciali)
  - Indirizzo fisico e telefono
  - Orario di consegna (Fra)

### Dopo la registrazione:
Per ogni utente bisogna salvare:
  1. Uno storico ordini
  2. Informazioni inserite
  3. Mail e password salvate e criptate
  4. Token per ricordarsi dell'accesso di un utente e per disconnettere gli altri dispositivi

### Implementazione sicura
La password salvata nel database è hashed, e nei cookie viene salvato un identificativo ed un token generato casualmente. I due vengono criptati con questa chiave, dato che i cookie sono leggibili da tutti

chiave: n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&

### Eliminazione degli utenti
Ogni foreign key ha: ONUPDATE e ONDELETE impostato a CASCADE. Basta cambiare una riga in utenti che tutte le informazioni di quell'utente vengono eliminate. Allo stesso modo, se viene cambiato l'user_id, viene aggiornato automaticamente su tutte le tabelle. È quindi possibile eliminare facilmente un utente, dato che basta eliminare la sua riga dalla tabella "utenti"

### Indirizzi all'interno del database
Tutte gli apostrofi all'interno degli indirizzi sono state sostituiti con &#39, secondo lo standard html. Questo è fatto per evitare errori negli inserimenti all'interno del database. Quando si vuole inserire quel particolare record all'interno di un tag html, quel codice viene automaticamente sostituito con un'apostrofo dal browser

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
  - indirizzo varchar(200) :arrow_right: not null
  - prezzo smallint :arrow_right: not null

Contenuto:
  - order_id bigint :arrow_right: not null (fk on Ordini)
  - oggetto varchar(250) :arrow_right: not null
  - qt smallint :arrow_right: not null

Ristoranti:
  - rest_id bigserial :arrow_right: primary key
  - nome varchar(250) :arrow_right: not null
  - immagine char(28) :arrow_right: not null
  - categoria varchar(50) :arrow_right: not null
  - descrizione varchar(50) :arrow_right: not null
  - orapertura char(5) :arrow_right: not null
  - orachiusura char(5) :arrow_right: not null
  - indirizzo varchar(50) :arrow_right: not null
  - costo_consegna smallint
  - voto char(3)
  - prezzo varchar(3) :arrow_right: not null

Menu:
  - rest_id bigint :arrow_right: not null (fk on rest_id in ristoranti)
  - oggetto char(50) :arrow_right: not null
  - categoria varchar(50) :arrow_right: not null
  - prezzo smallint :arrow_right: not null
  - ingrediente1 varchar(50)
  - ingrediente2 varchar(50)
  - ingrediente3 varchar(50)