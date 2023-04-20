<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/homepage.css">
    <style>
      input {
        margin-bottom: 5px;
        height: 21px;
        border-radius: 10px;
        text-align: left;
        padding-left: 8px;
      }

      .verticalform {
        margin: auto;
        width: 50%;
      }

      /* Custom version of "My Buttons"*/
      button {
        height: 40px;
        padding: 9px 25px;
        background-color: rgba(0, 136, 169, 1);
        border: none;
        border-radius: 50px;
        cursor: pointer;
      }

      button:hover{
        transition-delay: 0.1s;
        transition-duration: 0.4s;
        background-color: rgba(0, 136, 169, 0.8);
      }

      .errore { color: red; font-size: small; }
      .fullin { width: 200px; }
      .halfin { width: 18vw; }
      .formstyle { padding-top: 10vh;}
      .verticaladdrcontainer { min-width: 300px; }

      @media (max-width: 500px){
       /* Mobiles */
       .leftline{ width: 45%; float: left; text-align: center;}
       .rightline { width: 45%; float: right; text-align: center;}
       .littleinput { width: 85%; }
       button { width: 100% }
      } 

      @media (min-width: 1000px) {
        /* For Desktop: */
        .verticaladdrcontainer {
          float: left;
          margin-right: 5%;
          margin-left: 5%;
          width: 60%;
          padding-top: 12vh;
        }

        .verticalform {
          float: right;

          padding-top: 12vh;

          width: 25%;
          margin-right: 3%;

          height: 10vh;
        }

        .verticaladdresses {
          float: left;

          width: 16vw;

          margin-left: 4%;
          height: min(45px, 5vmin);
          line-height: min(45px, 5vmin); /* same as height! */

          display: table-cell;
          vertical-align: middle;
          margin-top: 15px;
        }

        .verticalbuttons {
          float: right;
          text-align: right;

          width: 41.7%;
          min-width: 276px;

          height: min(45px, 5vmin);
          margin-top: 15px;
        }

        /* Form elements */
        .fullin { width: 92%; max-width: 330px; }
        .halfin { width: 42.1%; max-width: 155px; }
        .formbt { width: 99%; max-width: 340px; }
        .formstyle { padding-left: 4vw; }

      }
    </style>

    <script>
      // This function is a portion of the function defined in js/signup.js
      function verifyAddr(){
        isOk = true;
        // and the address is valid, if given
        if(!document.getElementById("errorindirizzo").hasAttribute("hidden")) isOk = false;
        if(!document.getElementById("capinvalida").hasAttribute("hidden")) isOk = false;

        if(isOk){
          // If it's "ok" (client side), I can submit the form and pass it to the server
          document.getElementById("signupform").submit()
        }
        return isOk;
      }

      function checkIndirizzo(){
        // if some is not empty, then it's not valid
        sum = (+ document.getElementById("indirizzo").value != "") + (+ document.getElementById("cap").value != "") + (+ document.getElementById("citta").value != "");
        if(!(sum == 0 || sum == 3)) return false;
        if(sum == 0) return true;

        cap = document.getElementById("cap").value;

        if(cap.length != 5 || isNaN(cap)) return false;

        document.getElementById("addaddress").submit();
      }
    </script>

    <!-- I will create the php functions in here -->
    <?php
      if(array_key_exists("mkdef", $_POST)) { makedefualt($_POST["mkdef"]); }
      else if(array_key_exists("add", $_POST)) { add_address($_POST["add"]); }
      else if(array_key_exists("del", $_POST)){ delete_address($_POST["del"]); }


      // I also need to think on how to get the userid
      function makedefualt($usrid, $address) {
        $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
        
        // I need to call the queries to change the items in makedefault
        
        
        pg_close($db);
      }

      function add_address() {
        echo "This is Button2 that is selected";
      }
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

      $delimiter = chr(007);
      $iv = $_COOKIE["iv"];
      $info = $_COOKIE["saveduser"];
      $cipher = "aes-256-cbc";
      $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];
      
      // Getting the name from the db
      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $default_address = "select indirizzo from indirizzi where user_id = {$usrid} and def_indirizzo = true";
      $result = pg_query($db, $default_address) or die('Query failed:'.pg_last_error());
      $default_address = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);

      $addresses = "select indirizzo from indirizzi where user_id = {$usrid} and def_indirizzo = false";
      $result = pg_query($db, $addresses) or die('Query failed:'.pg_last_error());
      $addresses = pg_fetch_array($result, null, PGSQL_NUM); //array with addresses, indexed by a number
      pg_free_result($result);
      pg_close($db);

      // This needs to be transformed with a for loop based on the number of the query
      echo "
        <div>
          <div class=\"verticaladdrcontainer\">
            <div> Indirizzo di default: </div>
            <div> {$default_address} </div>
            <hr>
      ";
      
      //<button> Add another address </button>
      if($addresses != false && count($addresses) > 0){
        for($i = 0; $i < count($addresses); $i++){
          echo "
            <div class=\"verticaladdresses\"> ".$addresses[0]."</div>
            <div class=\"verticalbuttons\">
              <button> Rendi default </button>
              <button> Elimina </button>
            </div>
          ";
        }
      }

      echo "
          </div>
          <div class=\"verticalform\">
            <form class=\"formstyle\" id=\"addaddress\" method=\"post\" action=\"\">
              Indirizzo: <br>
              <input class=\"fullin\" type=\"text\" name=\"indirizzo\" id=\"indirizzo\" onblur=\"checkIndirizzo()\" oninput=\"checkIndirizzo()\"> <br>
              <div class=\"leftline\"> <span> CAP: </span> <input class=\"littleinput\" type=\"text\" name=\"cap\" id=\"cap\" maxlength=\"5\" minlength=\"5\" onblur=\"checkIndirizzo()\" oninput=\"checkIndirizzo()\"> </div>
              <div class=\"rightline\"> <span> Citta: </span> <input class=\"littleinput\" type=\"text\" name=\"citta\" id=\"citta\" onblur=\"checkIndirizzo()\" oninput=\"checkIndirizzo()\"> </div>
              <div class=\"errore\" id=\"errorindirizzo\" hidden> Indirizzo non completo </div>
              <div class=\"errore\" id=\"capinvalida\" hidden> Cap non corretto </div>
              <button class=\"formbt\" type=\"button\" onclick=\"verifyForm()\"> Aggiungi Indirizzo </button>
            </form>
          </div>
      </div>
      ";
    ?>
  </body>
</html>