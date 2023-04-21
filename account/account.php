<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/homepage.css">

    <!-- css for logo -->
    <link rel="stylesheet" href="/logo/logostyle.css">

    <link rel="stylesheet" href="/css/account.css">

  

    <style>
      .right {
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

      .change_button {
        margin-top: 20px;
        width: 500px;
        text-align: center;
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

    <script src="/js/account.js"> </script>

  </head>
  <body>
    <header>
      <!-- logo header -->
      <img class="logo" src="/logo/logo.png" alt="logo">

      <div class="redirects">
        <a href="#"> Ordini </a> <br>
        <a href="/account/addresses.php"> Indirizzi </a> <br>
        <a href="#"> Pagamenti </a> <br>
      </div>
    </header>

    <div>

      <div class="right">
        <div>
          <a> Nome </a> <br>
          <a> Email </a> <br>
        <div>

        <div class="change_button">
          <a onclick="showChange(item, 0)"> Cambia email </a>
          <a onclick="showChange(item, 1)"> Cambia password </a>

          <div class="change_item" id="item">
            <input type="email1">
            <input type="email2">
            <button> </button>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>