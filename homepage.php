<!-- drop down menu-->
<!DOCTYPE html>
<html>
  <head>
    <title> BiteBuddies Homepage </title>>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>  
    <script src="/js/homepage.js"> </script>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="/logo/logostyle.css">
    <link rel="stylesheet" href="/css/homepage.css">
    <link rel="stylesheet" href="/css/mybuttons.css">

    <style>
      /* Header portion */
      /* My Dropdown */
      .mydropdown {
        background-color: rgba(0, 136, 169, 1);
        border: none;
        border-radius: 50px;
        transition: all 0.3 ease 0s;
        font-weight: 500;
      }

      .mydropdown:hover {
        background-color: rgba(0, 136, 169, 0.8);
      }

      /* Dropdown background */
      .dropdownbackground {
        background-color: rgb(25, 70, 85);
        font-weight: 500;
      }

      /* Dropdown item */
      .dropdownitem {
        color: white;
        transition: 0.4s;
        font-weight: 500;
      }

      .dropdownitem:hover{
        background-color: rgba(5, 50, 55);
        color: white;
      }

      .dropdown:hover>.dropdown-menu {
        display: block;
      }

      .dropdown>.dropdown-toggle:active {
        /*Without this, clicking will make it sticky*/
        pointer-events: pointer;
      }

      /* Research bar */
      .rbar {
        height: 4vh;
        min-height: 30px;
        max-height: 36px;
        width: 30vw;
        resize: none;
        border-radius: 30px;
        padding: 3px 1vw;
      }


      /* Finished header portion */

      .area-text {
        background-color: white;
        height: 30px;
        width: 470px;
        border-radius: 200px;
        text-align: left;
        padding-left: 15px;
      }
      .catene-text {
        border-radius: 200px;
        border-color: white;
        text-align: center; 
        background-color: rgb(255, 81, 0);
      }

      .bottoni {
        position: relative;
        left: 120px;
      }
      
      table:hover {
        border-collapse: collapse;
        border-radius: 20px 20px 20px 20px;
        background-color: rgb(255, 81, 0);
        scale: 1.05;
        transition-duration: 1s;
      }
    </style>

  </head>
  <body>
    <span>
      <header style="background-color: rgb(0, 45, 60);">
        <!-- logo header -->
        <img class="logo" src="/logo/logo.png" alt="logo">

        <!-- barra di navigazione header -->
        <textarea class="rbar" name="cerca" class="area-text"  placeholder="Cerca ristorante:" autocomplete="off"></textarea>
      
      <!-- Login & Signup -->
      <?php
        // for now I'm setting the cookie as for testing purposes
        if(isset($_COOKIE["saveduser"])){
          $delimiter = chr(007);
          $iv = $_COOKIE["iv"];
          $info = $_COOKIE["saveduser"];
          $cipher = "aes-256-cbc";

          $usrid = preg_split("/{$delimiter}/", openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv))[0];
          
          // Getting the name from the db
          $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

          $username = "select nome from persone where user_id = '{$usrid}'";
          $result = pg_query($db, $username) or die('Query failed:'.pg_last_error());
          $name = pg_fetch_array($result, null, PGSQL_NUM)[0]; //array with indexes a number

          pg_free_result($result);
          
          echo '
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle mydropdown" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <span>
                  Ciao, '.$name.'
                  <!-- img -->
                  <img height="28" width="24" src="https://cdn.jsdelivr.net/npm/remixicon@3.1.1/icons/User%20&%20Faces/user-3-line.svg">
                </span>
              </button>
              <ul class="dropdown-menu dropdownbackground" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item dropdownitem" href="#"> Account </a></li>
                <li><a class="dropdown-item dropdownitem" href="#"> Ordini </a></li>
                <li><a class="dropdown-item dropdownitem" href="#"> Metodi di pagamento </a></li>
                <li><a class="dropdown-item dropdownitem" href="/account/addresses.php"> Indirizzi di consegna </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item dropdownitem" onclick="quitUser()"> Esci </a></li>
              </ul>
            </div>
          </header>
          ';
        } else {
          echo '
              <nav>
                <div class="bottoni">
                  <ul class="nav_links">
                    <li><a href="/account/login.html"> Login </a></li>
                    <li><a href="/account/signup.html"> SignUp </a></li>
                  </ul>
                </div>
              </nav>
            </header>
          ';
        }
      ?>

    <!-- cucina body -->
    <div>
      <table width=250 height=160 cellpadding="0">
        <tr align="center">
          <th>
            <font color="white">CUCINA ROMANA</font>
          </th>
        </tr>
        <td>
          <a href="cucina_romana.html"><img width="100%" height="100%" src="./ricette-romane.jpeg"></a>
        </td>
      </table>
    </div>

    <br>
    
    <div class="catene-text">
      <h1><b><font style="color: rgb(0, 45, 60);">CATENE FAMOSE</font></b></h1>
    </div>
    
    <br>
    
    <div>
      <table width=250 height=160 border="1" cellpadding="0">
        <tr align="center">
          <th>
            <font color="white">MC DONALDS</font>
          </th>
        </tr>
        <td>
          <a href="cucina_romana.html"><img width="100%" height="100%" src="./ricette-romane.jpeg"></a>
        </td>
      </table>
    </div>
    
    
    
    <nav style="text-align: center; padding-top: 100px;";>
      <ul class="nav_links">
        <li><a href="#"> About </a></li>
        <li><a href="#"> Contact </a></li>
      </ul>
    </nav>
  </body>









    <!--
    <nav>
      <ul id="menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">Cucina</a></li>
        <li><a href="#">Servizi</a></li>
        <li><a href="#">Info</a></li>
      </ul>
    </nav> 

    ul#menu {
        font-family: Verdana, sans-serif;
        font-size: 11px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      ul#menu li {
        background-color: #FF831C;
        border-bottom: 5px solid #54BAE2;
        display: block;
        width: 150px;
        height: 30px;
        margin: 2px;
        float: left; /* elementi su singola riga */
      }
      ul#menu li a {
        color: #fff;
        display: block;
        font-weight: bold;
        line-height: 30px;
        text-decoration: none;
        width: 150px;
        height: 30px;
        text-align: center;
      }
      ul#menu li.active, ul#menu li:hover {
        background-color: #54BAE2;
        border-bottom: 5px solid #FF831C;
      } -->

   <!--  
      <nav class="navbar navbar-expand-md">
        <button class="navbar-toggler navbar-dark" type="button" data-toggle="collapse" data-target="#main-navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="main-navigation">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/account/login.html"> Login </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/account/signup.html"> SignUp </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
    -->

</html>