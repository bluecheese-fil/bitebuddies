<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/homepage.css">

    <!-- css for logo -->
    <link rel="stylesheet" href="/logo/logostyle.css">

    <link rel="stylesheet" href="/css/account.css">

  

    <style>
      .leftdiv {
        float: left;
        margin-top: 5vh;
      }

      .redirects {
        vertical-align: middle;

        background-color: rgb(10, 145, 180);;
        border-radius: 50px;
        padding: 2vh 50px 2vh 50px;
        border-style: dotted;
      }

      .change_item {
        visibility: hidden;
        opacity: 0;

        background-color: red;
        padding: 20px 20px 20px 20px;
        border-radius: 20px;
        transition: visibility 0s, opacity 0.5s linear;
      }

      input {
        width: 100%;
        height: 25px;
        
        text-align: left;
        
        margin-bottom: 5px;
        padding-left: 8px;
        border-radius: 10px;
      }
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"> </script>
    <script src="/js/account.js"> </script>
    <script src="/js/generalFunctions.js"> </script>

    <?php
      // getting name and email
      $delimiter = chr(007);
      $iv = $_COOKIE["iv"];
      $info = $_COOKIE["saveduser"];
      $cipher = "aes-256-cbc";
      $info = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];
      $usrid = $info[0];
      $email = $info[1];

      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $name = "select nome from persone where user_id = '{$usrid}'";
      $result = pg_query($db, $name) or die('Query failed:'.pg_last_error());
      $name = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number
      pg_free_result($result);

      pg_close($db);
    ?>

  </head>
  <body onclick=removeChange(event)>
    <header>
      <!-- logo header -->
      <img class="logo" src="/logo/logo.png" alt="logo">

      <div class="redirects">
        <a href="#"> Ordini </a> <br>
        <a href="/account/addresses.php"> Indirizzi </a> <br>
        <a href="#"> Pagamenti </a> <br>
        <a href="#" onclick="exitEveryWhere()"> Rimuovi ogni dispositivo salvato </a> <br>
        <a href="#" onclick="quitUser()"> Esci </a> <br>
      </div>
    </header>

    <div class="leftdiv">
      <div> <a> Nome: </a> <a> <?php echo "{$name}"; ?> </a> </div>
      <div> <a> Email: </a> <a> <?php echo "{$email}"; ?> </a> </div>
    </div>

    <div style="margin: auto; margin-top: 20vh; width: 50%; text-align: center;">
      <div>
        <a id="cambiaemail"> Cambia email </a>
        <a id="cambiapassword"> Cambia password </a>
      </div>

      <div class="change_item" id="form_container">
        <input id="first_item">
        <input id="second_item">
        <button id="submit_item"> </button>
      </div>
    </div>
  </body>
</html>