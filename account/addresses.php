<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/homepage.css">
    <link rel="stylesheet" href="/css/addresses.css">

    <!-- external javascript functions -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"> </script>
    <script src="/js/addresses.js"> </script>

    <!-- This will prevent any resubmission in case of a refresh or back button -->
    <script>
    if (window.history.replaceState) { window.history.replaceState( null, null, window.location.href ); }
    </script>

    <!-- Importing the php functions and getting usrid -->
    <?php
      //getting the usrid
      $delimiter = chr(007);
      $iv = $_COOKIE["iv"];
      $info = $_COOKIE["saveduser"];
      $cipher = "aes-256-cbc";
      $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];
    ?>

  </head>
  <body>
    <?php
      // db connection
      if(!isset($_COOKIE["saveduser"])){
        echo "
        <div>
          You must first login to access this page! Redirecting you now...
        </div>
        ";

        header('Refresh: 4; URL=/account/login.html');
        die();
      }

      // usrid has been defined above, in the php called in the head section
      // Getting the name from the db
      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $default_address = "select indirizzo from indirizzi where user_id = '{$usrid}' and def_indirizzo = 'true'";
      $result = pg_query($db, $default_address) or die('Query failed:'.pg_last_error());
      $default_address = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);

      $addresses = "select indirizzo from indirizzi where user_id = '{$usrid}' and def_indirizzo = 'false'";
      $result = pg_query($db, $addresses) or die('Query failed:'.pg_last_error());
      $addresses = pg_fetch_all($result, PGSQL_NUM); //array with addresses, indexed by a number
      pg_free_result($result);
      pg_close($db);

      // This needs to be transformed with a for loop based on the number of the query
      echo "
          <div class=\"verticaladdrcontainer\">
            <div> Indirizzo di default: </div>
            <div> {$default_address} </div>
            <hr>
      ";

      //<button> Add another address </button>
      if($addresses != false && count($addresses) > 0){
        for($i = 0; $i < count($addresses); $i++){
          echo "
            <div class=\"verticaladdresses\" id = \"indr{$i}\">".$addresses[$i][0]."</div>
            <div class=\"verticalbuttons\">
              <button onclick=def_ind({$i}) > Rendi default </button>
              <button onclick=del_ind({$i}) > Elimina </button>
            </div>
          ";
        }
      }

      echo "
        </div>
        <div class=\"verticalform\">
          <div class=\"formstyle\" id=\"form_addadr\">
            Indirizzo: <br>
            <input class=\"fullin\" type=\"text\" name=\"indirizzo\" id=\"indirizzo\" onblur=\"checkInd()\" oninput=\"checkInd()\"> <br>
            <div class=\"leftline\"> <span class=\"itemtext\"> CAP: </span> <input class=\"littleinput\" type=\"text\" name=\"cap\" id=\"cap\" maxlength=\"5\" minlength=\"5\" onblur=\"checkInd()\" oninput=\"checkInd()\"> </div>
            <div class=\"rightline\"> <span class=\"itemtext\"> Citta: </span> <input class=\"littleinput\" type=\"text\" name=\"citta\" id=\"citta\" onblur=\"checkInd()\" oninput=\"checkInd()\"> </div>
            <div class=\"errore\" id=\"errorindirizzo\" hidden> Indirizzo non completo </div>
            <div class=\"errore\" id=\"capinvalida\" hidden> Cap non corretto </div>
            <button class=\"formbt\" type=\"button\" onclick=\"verifyAddr()\"> Aggiungi Indirizzo </button>
            <input type=\"text\" name=\"addadr\" id=\"addadr\" value=\"add\" hidden>
          </div>
        </div>
      ";
    ?>
  </body>
</html>