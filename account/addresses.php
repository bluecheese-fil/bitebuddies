<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/homepage.css">
    
    <!-- css for logo -->
    <link rel="stylesheet" href="/logo/logostyle.css">
    
    <!-- Dropdown css -->
    <link rel="stylesheet" href="/css/dropdown.css">
    <link rel="stylesheet" href="/css/addresses.css">

    <!-- external javascript functions -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"> </script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>  
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
      if(!isset($_COOKIE["saveduser"])){
        echo "
        <div>
          You must first login to access this page! Redirecting you now...
        </div>
        ";

        header('Refresh: 4; URL=/account/login.html');
        die();
      }

      // db connection
      // usrid has been defined above, in the php called in the head section
      // Getting from the db: -name, -default_address, - any other addresses
      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $default_address = "select indirizzo from indirizzi where user_id = '{$usrid}' and def_indirizzo = 'true'";
      $result = pg_query($db, $default_address) or die('Query failed:'.pg_last_error());
      $default_address = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);

      $addresses = "select indirizzo from indirizzi where user_id = '{$usrid}' and def_indirizzo = 'false'";
      $result = pg_query($db, $addresses) or die('Query failed:'.pg_last_error());
      $addresses = pg_fetch_all($result, PGSQL_NUM); //array with addresses, indexed by a number
      pg_free_result($result);
      
      $name = "select nome from persone where user_id = '{$usrid}'";
      $result = pg_query($db, $name) or die('Query failed:'.pg_last_error());
      $name = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);
      pg_close($db);

      echo "
      <header>
        <!-- logo header -->
        <img class=\"logo\" src=\"/logo/logo.png\" alt=\"logo\">

        <div class=\"dropdown\">
          <button class=\"btn btn-secondary dropdown-toggle mydropdown\" type=\"button\" id=\"dropdownMenuButton1\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">
            <span>
              Ciao, ".$name."
              <!-- img -->
              <img height=\"28\" width=\"24\" src=\"https://cdn.jsdelivr.net/npm/remixicon@3.1.1/icons/User%20&%20Faces/user-3-line.svg\">
            </span>
          </button>
          <ul class=\"dropdown-menu dropdownbackground\" aria-labelledby=\"dropdownMenuButton1\">
            <li><a class=\"dropdown-item dropdownitem\" href=\"/account/account.php\"> Account </a></li>
            <li><a class=\"dropdown-item dropdownitem\" href=\"#\"> Ordini </a></li>
            <li><a class=\"dropdown-item dropdownitem\" href=\"#\"> Metodi di pagamento </a></li>
            <li><a class=\"dropdown-item dropdownitem chosenlielement\"> Indirizzi di consegna </a></li>
            <li><hr class=\"dropdown-divider\"></li>
            <li><a class=\"dropdown-item dropdownitem\" href=\"#\" onclick=\"quitUser()\"> Esci </a></li>
          </ul>
        </div>
      </header>
      ";


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
              <button class=\"littlebutton\" onclick=def_ind({$i})> Rendi default </button>
              <button class=\"deletebutton\" onclick=del_ind({$i})> Elimina </button>
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